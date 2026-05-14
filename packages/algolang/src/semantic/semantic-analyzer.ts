import type { ASTNode, SymbolInfo, SymbolTable, CompilationError } from "@/types";
import { NodeType } from "@/types";
import { BUILTIN_NAMES } from "@/keywords";

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
		const position = node.token?.position ?? 0;

		for (const child of node.children ?? []) {
			if (child.type !== NodeType.VARIABLE) continue;
			const name = child.value as string;
			if (this.validateName(name, line, column, position)) {
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
		const position = node.token?.position ?? 0;

		for (const child of (node.children ?? []).slice(1)) {
			if (child.type !== NodeType.VARIABLE) continue;
			const name = child.value as string;
			if (this.validateName(name, line, column, position)) {
				this.defineSymbol(name, typeLabel, line, column);
			}
		}
	}

	/** Returns true if the name is valid (not a duplicate and not a built-in). */
	private validateName(name: string, line: number, column: number, position: number): boolean {
		if (BUILTIN_NAMES.has(name)) {
			this.errors.push({
				type: "ERROR",
				message: `Le nom '${name}' est une fonction intégrée et ne peut pas être utilisé comme nom de variable`,
				line,
				column,
				position,
				code: "BUILTIN_SHADOWING",
				explanation: `'${name}' est une fonction intégrée d'AlgoLang`,
				suggestion: `Choisissez un autre nom, par exemple '${name}Valeur' ou 'mon${name.charAt(0).toUpperCase()}${name.slice(1)}'`,
			});
			return false;
		}
		if (this.symbolTable.symbols.has(name)) {
			this.errors.push({
				type: "ERROR",
				message: `La variable '${name}' est déjà déclarée`,
				line,
				column,
				position,
				code: "DUPLICATE_VARIABLE",
				explanation: "Chaque variable doit avoir un nom unique dans son scope",
				suggestion: `Choisissez un autre nom pour la variable '${name}'`,
			});
			return false;
		}
		return true;
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
