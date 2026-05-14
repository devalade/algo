import type {
	Connection,
	TextDocuments,
	DocumentFormattingParams,
	TextEdit,
} from "vscode-languageserver/node";
import type { TextDocument } from "vscode-languageserver-textdocument";
import type { ASTNode } from "@devalade/algolang";
import { Lexer, Parser, NodeType } from "@devalade/algolang";

export function register(connection: Connection, documents: TextDocuments<TextDocument>): void {
	connection.onDocumentFormatting((params: DocumentFormattingParams): TextEdit[] => {
		return formatDocument(params, documents);
	});
}

function formatDocument(params: DocumentFormattingParams, documents: TextDocuments<TextDocument>): TextEdit[] {
	const document = documents.get(params.textDocument.uri);
	if (!document) return [];

	const text = document.getText();
	const tabSize = params.options.tabSize || 2;

	let formatted: string;
	try {
		const lexer = new Lexer(text);
		const tokens = lexer.tokenize();
		const parser = new Parser(tokens);
		const result = parser.parse();
		if (result.errors.length === 0) {
			formatted = new AlgoFormatter(tabSize).format(result.ast);
		} else {
			formatted = formatAlgoLangSource(text, tabSize);
		}
	} catch {
		formatted = formatAlgoLangSource(text, tabSize);
	}

	return [
		{
			range: {
				start: { line: 0, character: 0 },
				end: { line: document.lineCount, character: 0 },
			},
			newText: formatted,
		},
	];
}

// ── Precedence table for expression parenthesisation ─────────────────────────

const PREC: Record<string, number> = {
	ou: 1, OU: 1,
	et: 2, ET: 2,
	"=": 3, "<>": 3,
	"<": 4, "<=": 4, ">": 4, ">=": 4,
	"+": 5, "-": 5,
	"*": 6, "/": 6, "%": 6,
};

const BLOCK_STMT_TYPES = new Set([
	NodeType.IF_STATEMENT,
	NodeType.WHILE_STATEMENT,
	NodeType.FOR_STATEMENT,
	NodeType.REPEAT_STATEMENT,
	NodeType.COMPOUND_STATEMENT,
	NodeType.FUNCTION_DECLARATION,
	NodeType.PROCEDURE_DECLARATION,
]);

/**
 * Pretty-prints an AlgoLang AST back to formatted AlgoLang source.
 *
 * Guarantees:
 * - Keywords are uppercase
 * - Indentation is consistent
 * - Semicolons are placed after all simple statements
 * - Block statements (SI, TANTQUE, POUR, REPETER) are not followed by semicolons
 */
export class AlgoFormatter {
	private tabSize: number;
	private indentLevel = 0;

	constructor(tabSize = 2) {
		this.tabSize = tabSize;
	}

	public format(ast: ASTNode): string {
		return this.printNode(ast) + "\n";
	}

	private indent(): string {
		return " ".repeat(this.tabSize * this.indentLevel);
	}

	private printNode(node: ASTNode): string {
		switch (node.type) {
			case NodeType.PROGRAM:        return this.printProgram(node);
			case NodeType.BLOCK:          return this.printBlock(node);
			case NodeType.VAR_DECLARATION:  return this.printVarDecl(node);
			case NodeType.ARRAY_DECLARATION: return this.printArrayDecl(node);
			case NodeType.COMPOUND_STATEMENT: return this.printCompound(node);
			case NodeType.ASSIGNMENT:     return this.printAssign(node);
			case NodeType.IF_STATEMENT:   return this.printIf(node);
			case NodeType.WHILE_STATEMENT: return this.printWhile(node);
			case NodeType.FOR_STATEMENT:  return this.printFor(node);
			case NodeType.REPEAT_STATEMENT: return this.printRepeat(node);
			case NodeType.READ_STATEMENT: return this.printRead(node);
			case NodeType.WRITE_STATEMENT: return this.printWrite(node);
			case NodeType.RETURN_STATEMENT: return this.printReturn(node);
			case NodeType.FUNCTION_CALL:  return this.printCallStmt(node);
			case NodeType.FUNCTION_DECLARATION: return this.printFunctionDecl(node);
			case NodeType.PROCEDURE_DECLARATION: return this.printProcedureDecl(node);
			default: return "";
		}
	}

	private printProgram(node: ASTNode): string {
		const name = node.value as string;
		const block = node.children?.[0];
		const lines: string[] = [`PROGRAMME ${name};`];
		if (block) lines.push(this.printNode(block));
		return lines.join("\n");
	}

	private printBlock(node: ASTNode): string {
		const lines: string[] = [];
		const children = node.children ?? [];

		// children[0] is always the declarations BLOCK (may be empty)
		// children[1..n-1] are FUNCTION/PROCEDURE declarations
		// children[n] is the main COMPOUND_STATEMENT (DEBUT...FIN)

		const [declBlock, ...rest] = children;

		// VAR section
		if (declBlock?.children?.length) {
			lines.push("VAR");
			this.indentLevel++;
			for (const decl of declBlock.children) {
				lines.push(this.indent() + this.printNode(decl));
			}
			this.indentLevel--;
		}

		// Subprograms (functions and procedures)
		for (const child of rest) {
			if (child.type === NodeType.FUNCTION_DECLARATION || child.type === NodeType.PROCEDURE_DECLARATION) {
				lines.push("");
				lines.push(this.printNode(child));
			}
		}

		// Main body (COMPOUND_STATEMENT = DEBUT...FIN)
		const mainBody = rest.at(-1);
		if (mainBody?.type === NodeType.COMPOUND_STATEMENT) {
			lines.push(this.printNode(mainBody));
		}

		return lines.join("\n");
	}

	private printVarDecl(node: ASTNode): string {
		const type = (node.value as string).toUpperCase();
		const names = (node.children ?? []).map((c) => c.value as string).join(", ");
		return `${names}: ${type};`;
	}

	private printArrayDecl(node: ASTNode): string {
		const elemType = (node.value as string).toUpperCase();
		const size = node.children?.[0]?.value as number;
		const names = (node.children ?? []).slice(1).map((c) => c.value as string).join(", ");
		return `${names}: TABLEAU[${size}] DE ${elemType};`;
	}

	private printCompound(node: ASTNode): string {
		const lines: string[] = ["DEBUT"];
		this.indentLevel++;

		const stmts = node.children ?? [];
		for (let i = 0; i < stmts.length; i++) {
			const stmt = stmts[i]!;
			const isBlock = BLOCK_STMT_TYPES.has(stmt.type);
			const code = this.printNode(stmt);
			const line = this.indent() + code + (isBlock ? "" : ";");
			// Blank line before block statements for readability
			if (isBlock && i > 0) lines.push("");
			lines.push(line);
		}

		this.indentLevel--;
		lines.push("FIN");
		return lines.join("\n");
	}

	private printAssign(node: ASTNode): string {
		const target = node.children?.[0];
		const expr = node.children?.[1];
		if (!target || !expr) return "";
		const targetStr = target.type === NodeType.ARRAY_ACCESS
			? `${target.value as string}[${this.printExpr(target.children![0]!)}]`
			: (target.value as string);
		return `${targetStr} := ${this.printExpr(expr)}`;
	}

	private printIf(node: ASTNode): string {
		const [cond, then, els] = node.children ?? [];
		if (!cond || !then) return "";
		const lines = [`SI ${this.printExpr(cond)} ALORS`];
		lines.push(...this.printBlockBody(then));
		if (els) {
			lines.push(this.indent() + "SINON");
			lines.push(...this.printBlockBody(els));
		}
		lines.push(this.indent() + "FINSI");
		return lines.join("\n");
	}

	private printWhile(node: ASTNode): string {
		const [cond, body] = node.children ?? [];
		if (!cond || !body) return "";
		const lines = [`TANTQUE ${this.printExpr(cond)} FAIRE`];
		lines.push(...this.printBlockBody(body));
		lines.push(this.indent() + "FINTANTQUE");
		return lines.join("\n");
	}

	private printFor(node: ASTNode): string {
		const [varNode, start, end, body] = node.children ?? [];
		if (!varNode || !start || !end || !body) return "";
		const varName = varNode.value as string;
		const lines = [`POUR ${varName} ALLANT DE ${this.printExpr(start)} A ${this.printExpr(end)} FAIRE`];
		lines.push(...this.printBlockBody(body));
		lines.push(this.indent() + "FINPOUR");
		return lines.join("\n");
	}

	private printRepeat(node: ASTNode): string {
		const stmts = node.children ?? [];
		const cond = stmts.at(-1)!;
		const body = stmts.slice(0, -1);
		const lines = ["REPETER"];
		this.indentLevel++;
		for (const stmt of body) {
			const isBlock = BLOCK_STMT_TYPES.has(stmt.type);
			lines.push(this.indent() + this.printNode(stmt) + (isBlock ? "" : ";"));
		}
		this.indentLevel--;
		lines.push(this.indent() + `JUSQU'A ${this.printExpr(cond)}`);
		return lines.join("\n");
	}

	private printRead(node: ASTNode): string {
		const target = node.children?.[0];
		if (!target) return "";
		const arg = target.type === NodeType.ARRAY_ACCESS
			? `${target.value as string}[${this.printExpr(target.children![0]!)}]`
			: (target.value as string);
		return `LIRE(${arg})`;
	}

	private printWrite(node: ASTNode): string {
		const args = (node.children ?? []).map((c) => this.printExpr(c)).join(", ");
		return `ECRIRE(${args})`;
	}

	private printReturn(node: ASTNode): string {
		const expr = node.children?.[0];
		return expr ? `RETOURNER ${this.printExpr(expr)}` : "RETOURNER";
	}

	private printCallStmt(node: ASTNode): string {
		const name = node.value as string;
		const args = (node.children ?? []).map((c) => this.printExpr(c)).join(", ");
		return `${name}(${args})`;
	}

	private printFunctionDecl(node: ASTNode): string {
		const name = node.value as string;
		const [paramList, retTypeNode, body] = node.children ?? [];
		const params = this.printParamList(paramList);
		const retType = (retTypeNode?.value as string ?? "").toUpperCase();
		const lines = [`FONCTION ${name}(${params}): ${retType}`];
		if (body) lines.push(this.printNode(body));
		return lines.join("\n");
	}

	private printProcedureDecl(node: ASTNode): string {
		const name = node.value as string;
		const [paramList, body] = node.children ?? [];
		const params = this.printParamList(paramList);
		const lines = [`PROCEDURE ${name}(${params})`];
		if (body) lines.push(this.printNode(body));
		return lines.join("\n");
	}

	private printParamList(paramList: ASTNode | undefined): string {
		if (!paramList?.children?.length) return "";
		return paramList.children.map((p) => {
			const name = p.value as string;
			const type = p.symbolInfo?.type ?? "";
			return `${name}: ${type.toUpperCase()}`;
		}).join("; ");
	}

	// Indented body of a block (IF branch, WHILE body, FOR body)
	private printBlockBody(body: ASTNode): string[] {
		this.indentLevel++;
		const stmts = body.type === NodeType.COMPOUND_STATEMENT
			? (body.children ?? [])
			: [body];
		const lines: string[] = [];
		for (const stmt of stmts) {
			const isBlock = BLOCK_STMT_TYPES.has(stmt.type);
			lines.push(this.indent() + this.printNode(stmt) + (isBlock ? "" : ";"));
		}
		this.indentLevel--;
		return lines;
	}

	// ── Expression printer ────────────────────────────────────────────────────

	private printExpr(node: ASTNode, parentPrec = 0): string {
		switch (node.type) {
			case NodeType.LITERAL:
				return this.printLiteral(node);
			case NodeType.VARIABLE:
				return node.value as string;
			case NodeType.ARRAY_ACCESS: {
				const idx = this.printExpr(node.children![0]!);
				return `${node.value as string}[${idx}]`;
			}
			case NodeType.FUNCTION_CALL: {
				const name = node.value as string;
				const args = (node.children ?? []).map((c) => this.printExpr(c)).join(", ");
				return `${name}(${args})`;
			}
			case NodeType.BINARY_OP: {
				const op = node.value as string;
				const prec = PREC[op] ?? 5;
				const left = this.printExpr(node.children![0]!, prec);
				const right = this.printExpr(node.children![1]!, prec + 1);
				const inner = `${left} ${op.toUpperCase()} ${right}`;
				return prec < parentPrec ? `(${inner})` : inner;
			}
			case NodeType.UNARY_OP: {
				const op = (node.value as string).toUpperCase();
				const operand = this.printExpr(node.children![0]!, 7);
				return op === "NON" ? `NON ${operand}` : `${op}${operand}`;
			}
			default:
				return String(node.value ?? "");
		}
	}

	private printLiteral(node: ASTNode): string {
		if (typeof node.value === "boolean") return node.value ? "VRAI" : "FAUX";
		if (typeof node.value === "string") return `"${node.value}"`;
		return String(node.value);
	}
}

// ── Regex-based fallback (used when the document has parse errors) ────────────

export function formatAlgoLangSource(text: string, tabSize: number): string {
	const lines = text.split(/\r?\n/);
	let indentLevel = 0;
	const indent = " ".repeat(tabSize);

	const formattedLines = lines.map(line => {
		const trimmed = line.trim();
		if (!trimmed) return "";

		// Decrease indent for closing keywords
		if (trimmed.match(/^(DEBUT|FIN|FINSI|FINTANTQUE|FINPOUR|SINON)\b/i)) {
			indentLevel = Math.max(0, indentLevel - 1);
		}

		if (trimmed.match(/^JUSQU'A\b/i)) {
			indentLevel = Math.max(0, indentLevel - 1);
		}

		const newLine = indent.repeat(indentLevel) + trimmed;

		if (trimmed.match(/^(VAR|DEBUT|SI|SINON|REPETER)\b/i)) {
			indentLevel++;
		}

		if (trimmed.match(/^(TANTQUE|POUR)\b.*\bFAIRE\b/i)) {
			indentLevel++;
		}

		if (trimmed.match(/^FAIRE\b/i)) {
			indentLevel++;
		}

		return newLine;
	});

	return formattedLines.join("\n") + "\n";
}
