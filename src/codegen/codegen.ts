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
			case "BINARY_OP":
				return this.generateBinaryOp(node);
			case "UNARY_OP":
				return this.generateUnaryOp(node);
			case "LITERAL":
				return this.generateLiteral(node);
			case "VARIABLE":
				return this.generateVariable(node);
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

		lines.push(`// Programme: ${node.value}`);
		lines.push("async function main() {");

		this.indentLevel++;

		if (node.children && node.children.length > 0) {
			for (const child of node.children) {
				const childCode = this.generateNode(child);
				if (childCode) {
					lines.push(this.indent(childCode));
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
					lines.push(this.indent(childCode));
				}
			}
		}

		return lines.join("\n");
	}

	private generateAssignment(node: ASTNode): string {
		if (!node.children || node.children.length < 2) {
			return "";
		}

		const variable = node.children[0];
		const expression = node.children[1];

		if (!variable || !expression) {
			return "";
		}

		const variableName = variable.value as string;
		const expressionCode = this.generateNode(expression);

		return `${variableName} = ${expressionCode};`;
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
		if (!node.children || node.children.length === 0) {
			return "";
		}

		const variable = node.children[0];
		if (!variable) {
			return "";
		}

		const variableName = variable.value as string;

		// Vérifier le type de la variable depuis la table des symboles
		const symbolInfo = this.symbolTable.symbols.get(variableName);
		let conversion = "";

		if (symbolInfo) {
			switch (symbolInfo.type) {
				case "ENTIER":
				case "REEL":
					conversion = "parseInt(";
					break;
				case "BOOLEEN":
					conversion = "(";
					break;
				default:
					conversion = "";
			}
		}

		if (conversion) {
			return `${variableName} = ${conversion}await lire(""));`;
		} else {
			return `${variableName} = await lire("");`;
		}
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
