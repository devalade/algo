import type { ASTNode, SymbolInfo, SymbolTable, CompilationError } from "@/types";
import { NodeType } from "@/types";

export interface SemanticResult {
	symbolTable: SymbolTable;
	errors: CompilationError[];
}

/**
 * Walks a fully-constructed AST and produces the SymbolTable.
 *
 * Separated from the Parser so each pass is independently testable:
 * - Parser tests verify AST shape and syntactic errors only.
 * - SemanticAnalyzer tests verify symbol resolution and DUPLICATE_VARIABLE
 *   without needing a fully valid parse.
 */
export class SemanticAnalyzer {
	private symbolTable: SymbolTable = {
		symbols: new Map(),
		children: [],
		scopeName: "global",
	};
	private errors: CompilationError[] = [];

	public analyze(ast: ASTNode): SemanticResult {
		this.walk(ast);
		return { symbolTable: this.symbolTable, errors: this.errors };
	}

	private walk(node: ASTNode): void {
		switch (node.type) {
			case NodeType.VAR_DECLARATION:
				this.collectVarDeclaration(node);
				break;
			case NodeType.ARRAY_DECLARATION:
				this.collectArrayDeclaration(node);
				break;
			default:
				node.children?.forEach((child) => this.walk(child));
				break;
		}
	}

	private collectVarDeclaration(node: ASTNode): void {
		const algoType = node.value as string;
		const line = node.token?.line ?? 0;
		const column = node.token?.column ?? 0;

		for (const child of node.children ?? []) {
			if (child.type !== NodeType.VARIABLE) continue;
			const name = child.value as string;
			if (this.symbolTable.symbols.has(name)) {
				this.errors.push({
					type: "ERROR",
					message: `La variable '${name}' est déjà déclarée`,
					line,
					column,
					position: node.token?.position ?? 0,
					code: "DUPLICATE_VARIABLE",
					explanation: "Chaque variable doit avoir un nom unique dans son scope",
					suggestion: `Choisissez un autre nom pour la variable '${name}'`,
				});
			} else {
				this.defineSymbol(name, algoType, line, column);
			}
		}
	}

	private collectArrayDeclaration(node: ASTNode): void {
		const elemType = node.value as string;
		const sizeNode = node.children?.[0];
		const size = sizeNode?.value as number;
		const typeLabel = `TABLEAU[${size}] DE ${elemType}`;
		const line = node.token?.line ?? 0;
		const column = node.token?.column ?? 0;

		for (const child of (node.children ?? []).slice(1)) {
			if (child.type !== NodeType.VARIABLE) continue;
			const name = child.value as string;
			if (this.symbolTable.symbols.has(name)) {
				this.errors.push({
					type: "ERROR",
					message: `La variable '${name}' est déjà déclarée`,
					line,
					column,
					position: node.token?.position ?? 0,
					code: "DUPLICATE_VARIABLE",
					explanation: "Chaque variable doit avoir un nom unique dans son scope",
					suggestion: `Choisissez un autre nom pour la variable '${name}'`,
				});
			} else {
				this.defineSymbol(name, typeLabel, line, column);
			}
		}
	}

	private defineSymbol(name: string, type: string, line: number, column: number): void {
		const info: SymbolInfo = {
			name,
			type,
			scope: this.symbolTable.scopeName,
			line,
			column,
		};
		this.symbolTable.symbols.set(name, info);
	}
}
