import type {
	ASTNode,
	SymbolTable,
	CompiledOutput,
	CompilationError,
	CompilerOptions,
} from "@/types";

export class CodeGenerator {
	private symbolTable: SymbolTable;
	private errors: CompilationError[] = [];
	private indentLevel: number = 0;

	constructor(symbolTable: SymbolTable, _options: CompilerOptions) {
		this.symbolTable = symbolTable;
	}

	public generate(ast: ASTNode): CompiledOutput {
		try {
			const output = this.generateJavaScript(ast);

			return {
				success: this.errors.length === 0,
				output,
				errors: this.errors,
				warnings: [],
				symbolTable: this.symbolTable,
				ast,
			};
		} catch (error) {
			return {
				success: false,
				output: "",
				errors: [
					...this.errors,
					{
						type: "ERROR",
						message:
							error instanceof Error
								? error.message
								: "Erreur inconnue lors de la génération de code",
						line: 0,
						column: 0,
						position: 0,
						code: "GENERATION_ERROR",
					},
				],
				warnings: [],
			};
		}
	}

	private generateJavaScript(ast: ASTNode): string {
		const lines: string[] = [];

		// En-tête du code JavaScript
		lines.push("// Code généré par AlgoLang");
		lines.push('import * as readline from "readline";');
		lines.push("");
		lines.push("const rl = readline.createInterface({");
		lines.push("  input: process.stdin,");
		lines.push("  output: process.stdout");
		lines.push("});");
		lines.push("");

		// Générer le code du programme
		const programCode = this.generateNode(ast);
		lines.push(programCode);

		// Fonctions utilitaires
		lines.push("");
		lines.push("// Fonctions utilitaires pour les entrées/sorties");
		lines.push("function lire(prompt) {");
		lines.push("  return new Promise((resolve) => {");
		lines.push("    rl.question(prompt, (answer) => {");
		lines.push("      resolve(answer.trim());");
		lines.push("    });");
		lines.push("  });");
		lines.push("}");
		lines.push("");
		lines.push("function ecrire(...args) {");
		lines.push("  console.log(...args);");
		lines.push("}");
		lines.push("");
		lines.push("// Point d'entrée principal");
		lines.push("main().then(() => {");
		lines.push("  rl.close();");
		lines.push("});");

		return lines.join("\n");
	}

	private generateNode(node: ASTNode): string {
		switch (node.type) {
			case "PROGRAM":
				return this.generateProgram(node);
			case "BLOCK":
				return this.generateBlock(node);
			case "VAR_DECLARATION":
				return this.generateVariableDeclaration(node);
			case "ARRAY_DECLARATION":
				return this.generateArrayDeclaration(node);
			case "COMPOUND_STATEMENT":
				return this.generateCompoundStatement(node);
			case "ASSIGNMENT":
				return this.generateAssignment(node);
			case "IF_STATEMENT":
				return this.generateIfStatement(node);
			case "WHILE_STATEMENT":
				return this.generateWhileStatement(node);
			case "FOR_STATEMENT":
				return this.generateForStatement(node);
			case "REPEAT_STATEMENT":
				return this.generateRepeatStatement(node);
			case "READ_STATEMENT":
				return this.generateReadStatement(node);
			case "WRITE_STATEMENT":
				return this.generateWriteStatement(node);
			case "FUNCTION_DECLARATION":
				return this.generateFunctionDeclaration(node);
			case "PROCEDURE_DECLARATION":
				return this.generateProcedureDeclaration(node);
			case "RETURN_STATEMENT":
				return this.generateReturnStatement(node);
			case "BINARY_OP":
				return this.generateBinaryOp(node);
			case "UNARY_OP":
				return this.generateUnaryOp(node);
			case "LITERAL":
				return this.generateLiteral(node);
			case "VARIABLE":
				return this.generateVariable(node);
			case "ARRAY_ACCESS":
				return this.generateArrayAccess(node);
			case "FUNCTION_CALL":
				return this.generateFunctionCall(node);
			default:
				this.errors.push({
					type: "ERROR",
					message: `Type de nœud non supporté: ${node.type}`,
					line: 0,
					column: 0,
					position: 0,
					code: "UNSUPPORTED_NODE_TYPE",
				});
				return "";
		}
	}

	private generateProgram(node: ASTNode): string {
		const lines: string[] = [];
		const block = node.children?.[0];

		lines.push(`// Programme: ${node.value}`);

		// Global declarations (vars, arrays, functions, procedures) live at module scope
		// so that procedures can read/write program-level variables.
		// AST shape: BLOCK → [BLOCK(var-section), PROCEDURE_DECLARATION*, COMPOUND_STATEMENT]
		if (block?.children) {
			for (const child of block.children) {
				if (child.type === "BLOCK") {
					// VAR section: emit each var/array declaration at module scope
					for (const decl of child.children ?? []) {
						lines.push(this.generateNode(decl));
					}
					lines.push("");
				} else if (
					child.type === "FUNCTION_DECLARATION" ||
					child.type === "PROCEDURE_DECLARATION"
				) {
					lines.push(this.generateNode(child));
					lines.push("");
				}
			}
		}

		lines.push("async function main() {");
		this.indentLevel++;

		// Émettre uniquement le corps principal (COMPOUND_STATEMENT)
		if (block?.children) {
			for (const child of block.children) {
				if (
					child.type !== "BLOCK" &&
					child.type !== "FUNCTION_DECLARATION" &&
					child.type !== "PROCEDURE_DECLARATION"
				) {
					const childCode = this.generateNode(child);
					if (childCode) {
						lines.push(this.indent(childCode));
					}
				}
			}
		}

		this.indentLevel--;
		lines.push("}");

		return lines.join("\n");
	}

	private generateBlock(node: ASTNode): string {
		const lines: string[] = [];

		if (node.children) {
			for (const child of node.children) {
				const childCode = this.generateNode(child);
				if (childCode) {
					lines.push(this.indent(childCode));
				}
			}
		}

		return lines.join("\n");
	}

	private generateVariableDeclaration(node: ASTNode): string {
		const lines: string[] = [];
		const varType = this.mapAlgoLangTypeToJS(node.value as string);

		if (node.children) {
			const variableNames = node.children
				.map((child) => child.value)
				.join(", ");
			lines.push(`let ${variableNames}; // ${varType}`);
		}

		return lines.join("\n");
	}

	private generateCompoundStatement(node: ASTNode): string {
		const lines: string[] = [];

		if (node.children) {
			for (const child of node.children) {
				const childCode = this.generateNode(child);
				if (childCode) {
					// Un appel de fonction/procédure utilisé comme instruction doit se terminer par ;
					const stmt =
						child.type === "FUNCTION_CALL"
							? childCode.replace(/^\(|\)$/g, "") + ";"
							: childCode;
					lines.push(this.indent(stmt));
				}
			}
		}

		return lines.join("\n");
	}

	private generateAssignment(node: ASTNode): string {
		if (!node.children || node.children.length < 2) {
			return "";
		}

		const target = node.children[0];
		const expression = node.children[1];

		if (!target || !expression) {
			return "";
		}

		const expressionCode = this.generateNode(expression);

		if (target.type === "ARRAY_ACCESS") {
			const arrayName = target.value as string;
			const index = this.generateNode(target.children![0]);
			return `${arrayName}[${index}] = ${expressionCode};`;
		}

		const variableName = target.value as string;
		return `${variableName} = ${expressionCode};`;
	}

	private generateArrayDeclaration(node: ASTNode): string {
		if (!node.children || node.children.length < 2) return "";
		const size = node.children[0].value as number;
		const elemType = node.value as string;
		const defaultValue = elemType === "BOOLEEN" ? "false" : elemType === "CHAINE" ? '""' : "0";
		const names = node.children.slice(1).map((c) => c.value as string);
		return names
			.map((name) => `let ${name} = new Array(${size}).fill(${defaultValue});`)
			.join("\n");
	}

	private generateArrayAccess(node: ASTNode): string {
		const name = node.value as string;
		const index = this.generateNode(node.children![0]);
		return `${name}[${index}]`;
	}

	private generateFunctionCall(node: ASTNode): string {
		const name = node.value as string;
		const args = (node.children ?? []).map((c) => {
			const code = this.generateNode(c);
			// Tableaux passés par valeur (copie)
			if (c.type === "VARIABLE") {
				const sym = this.symbolTable.symbols.get(c.value as string);
				if (sym?.type?.startsWith("TABLEAU")) return `${code}.slice()`;
			}
			return code;
		});

		// Fonctions mathématiques intégrées
		switch (name.toLowerCase()) {
			case "abs":          return `Math.abs(${args[0]})`;
			case "max":          return `Math.max(${args.join(", ")})`;
			case "min":          return `Math.min(${args.join(", ")})`;
			case "mod":          return `(${args[0]} % ${args[1]})`;
			case "racine_carree": return `Math.sqrt(${args[0]})`;
			case "taille":       return `${args[0]}.length`;
			case "sous_chaine":  return `${args[0]}.substring(${args[1]}, ${args[1]} + ${args[2]})`;
			case "concat":       return args.join(" + ");
			case "entier_en_reel": return `${args[0]}`;
			case "reel_en_entier": return `Math.trunc(${args[0]})`;
			default:
				// Fonction définie par l'utilisateur (async)
				return `(await ${name}(${args.join(", ")}))`;
		}
	}

	private generateFunctionDeclaration(node: ASTNode): string {
		const name = node.value as string;
		const [paramList, , body] = node.children ?? [];
		const params = this.generateParamList(paramList);
		const bodyCode = this.generateNode(body);
		const lines = [`async function ${name}(${params}) {`];
		this.indentLevel++;
		lines.push(this.indent(bodyCode));
		this.indentLevel--;
		lines.push("}");
		return lines.join("\n");
	}

	private generateProcedureDeclaration(node: ASTNode): string {
		const name = node.value as string;
		const [paramList, body] = node.children ?? [];
		const params = this.generateParamList(paramList);
		const bodyCode = this.generateNode(body);
		const lines = [`async function ${name}(${params}) {`];
		this.indentLevel++;
		lines.push(this.indent(bodyCode));
		this.indentLevel--;
		lines.push("}");
		return lines.join("\n");
	}

	private generateParamList(paramList: ASTNode | undefined): string {
		if (!paramList?.children) return "";
		return paramList.children.map((p) => p.value as string).join(", ");
	}

	private generateReturnStatement(node: ASTNode): string {
		if (!node.children?.[0]) return "return;";
		return `return ${this.generateNode(node.children[0])};`;
	}

	private generateIfStatement(node: ASTNode): string {
		if (!node.children || node.children.length < 2) {
			return "";
		}

		const condition = node.children[0];
		const thenStatement = node.children[1];
		const elseStatement = node.children[2];

		if (!condition || !thenStatement) {
			return "";
		}

		const conditionCode = this.generateNode(condition);
		const thenCode = this.generateNode(thenStatement);

		let code = `if (${conditionCode}) {\n`;
		this.indentLevel++;
		code += this.indent(thenCode) + "\n";
		this.indentLevel--;
		code += "}";

		if (elseStatement) {
			const elseCode = this.generateNode(elseStatement);
			code += " else {\n";
			this.indentLevel++;
			code += this.indent(elseCode) + "\n";
			this.indentLevel--;
			code += "}";
		}

		return code;
	}

	private generateWhileStatement(node: ASTNode): string {
		if (!node.children || node.children.length < 2) {
			return "";
		}

		const condition = node.children[0];
		const body = node.children[1];

		if (!condition || !body) {
			return "";
		}

		const conditionCode = this.generateNode(condition);
		const bodyCode = this.generateNode(body);

		let code = `while (${conditionCode}) {\n`;
		this.indentLevel++;
		code += this.indent(bodyCode) + "\n";
		this.indentLevel--;
		code += "}";

		return code;
	}

	private generateForStatement(node: ASTNode): string {
		if (!node.children || node.children.length < 4) {
			return "";
		}

		const variable = node.children[0];
		const startValue = node.children[1];
		const endValue = node.children[2];
		const body = node.children[3];

		if (!variable || !startValue || !endValue || !body) {
			return "";
		}

		const variableName = variable.value as string;
		const startCode = this.generateNode(startValue);
		const endCode = this.generateNode(endValue);
		const bodyCode = this.generateNode(body);

		let code = `for (let ${variableName} = ${startCode}; ${variableName} <= ${endCode}; ${variableName}++) {\n`;
		this.indentLevel++;
		code += this.indent(bodyCode) + "\n";
		this.indentLevel--;
		code += "}";

		return code;
	}

	private generateRepeatStatement(node: ASTNode): string {
		if (!node.children || node.children.length < 2) {
			return "";
		}

		// Le dernier enfant est la condition, les autres sont les instructions du corps
		const conditionIndex = node.children.length - 1;
		const condition = node.children[conditionIndex];
		const bodyStatements = node.children.slice(0, conditionIndex);

		if (!condition || bodyStatements.length === 0) {
			return "";
		}

		const conditionCode = this.generateNode(condition);

		let code = "do {\n";
		this.indentLevel++;

		// Générer les instructions du corps
		for (const statement of bodyStatements) {
			const statementCode = this.generateNode(statement);
			if (statementCode) {
				code += this.indent(statementCode) + "\n";
			}
		}

		this.indentLevel--;
		code += "} while (!(" + conditionCode + "));";

		return code;
	}

	private generateReadStatement(node: ASTNode): string {
		if (!node.children || node.children.length === 0) return "";

		const target = node.children[0];
		if (!target) return "";

		const isArray = target.type === "ARRAY_ACCESS";
		const varName = isArray
			? `${target.value as string}[${this.generateNode(target.children![0])}]`
			: (target.value as string);

		const symbolName = target.value as string;
		const symbolInfo = this.symbolTable.symbols.get(symbolName);
		const typeHint = symbolInfo?.type ?? "";

		if (typeHint.startsWith("ENTIER") || typeHint === "REEL" || typeHint.startsWith("TABLEAU")) {
			return `${varName} = parseInt(await lire(""));`;
		}
		return `${varName} = await lire("");`;
	}

	private generateWriteStatement(node: ASTNode): string {
		if (!node.children || node.children.length === 0) {
			return "";
		}

		// Générer le code pour toutes les expressions
		const expressionCodes: string[] = [];
		for (const child of node.children) {
			if (child) {
				const expressionCode = this.generateNode(child);
				expressionCodes.push(expressionCode);
			}
		}

		// Si une seule expression, utiliser ecrire direct
		if (expressionCodes.length === 1) {
			return `ecrire(${expressionCodes[0]});`;
		}

		// Si plusieurs expressions, les concaténer
		const concatenated = expressionCodes.join(", ");
		return `ecrire(${concatenated});`;
	}

	private generateBinaryOp(node: ASTNode): string {
		if (!node.children || node.children.length < 2) {
			return "";
		}

		const left = node.children[0];
		const right = node.children[1];
		const operator = node.value as string;

		if (!left || !right) {
			return "";
		}

		const leftCode = this.generateNode(left);
		const rightCode = this.generateNode(right);

		// Mapper les opérateurs AlgoLang vers JavaScript
		const jsOperator = this.mapOperator(operator);

		return `(${leftCode} ${jsOperator} ${rightCode})`;
	}

	private generateUnaryOp(node: ASTNode): string {
		if (!node.children || node.children.length === 0) {
			return "";
		}

		const operand = node.children[0];
		const operator = node.value as string;

		if (!operand) {
			return "";
		}

		const operandCode = this.generateNode(operand);

		if (operator === "non") {
			return `!(${operandCode})`;
		} else if (operator === "-") {
			return `-${operandCode}`;
		}

		return operandCode;
	}

	private generateLiteral(node: ASTNode): string {
		if (node.value === undefined || node.value === null) {
			return "null";
		}

		// Pour les booléens, retourner la valeur textuelle
		if (typeof node.value === "boolean") {
			return node.value ? "true" : "false";
		}

		// Pour les nombres, retourner la valeur
		if (typeof node.value === "number") {
			return node.value.toString();
		}

		// Pour les chaînes, retourner entre guillemets
		if (typeof node.value === "string") {
			return `"${node.value}"`;
		}

		return node.value?.toString() ?? "null";
	}

	private generateVariable(node: ASTNode): string {
		return node.value as string;
	}

	private mapAlgoLangTypeToJS(algoLangType: string): string {
		switch (algoLangType) {
			case "ENTIER":
				return "number";
			case "REEL":
				return "number";
			case "BOOLEEN":
				return "boolean";
			case "CHAINE":
				return "string";
			default:
				return "any";
		}
	}

	private mapOperator(operator: string): string {
		switch (operator) {
			case ":=":
				return "=";
			case "=":
				return "===";
			case "<>":
				return "!==";
			case "<":
				return "<";
			case "<=":
				return "<=";
			case ">":
				return ">";
			case ">=":
				return ">=";
			case "%":
				return "%";
			case "et":
				return "&&";
			case "ou":
				return "||";
			case "non":
				return "!";
			default:
				return operator;
		}
	}

	private indent(code: string): string {
		return "  ".repeat(this.indentLevel) + code;
	}
}
