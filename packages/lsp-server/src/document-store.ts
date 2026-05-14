import type { ASTNode, SymbolTable, CompilationError } from "@devalade/algolang";

export interface ParseResult {
	ast: ASTNode;
	symbolTable: SymbolTable;
	errors: CompilationError[];
	/** Monotonically increasing version counter so consumers can detect staleness. */
	version: number;
}

/**
 * Single source of truth for the most recent parse result of each open document.
 *
 * Replaces the two-Map approach in cache.ts where `symbolTables` and
 * `documentAsts` could diverge. Now every write is atomic: a single set()
 * call ensures AST and symbol table always belong to the same parse run.
 */
class DocumentStore {
	private store = new Map<string, ParseResult>();

	set(uri: string, result: ParseResult): void {
		this.store.set(uri, result);
	}

	get(uri: string): ParseResult | undefined {
		return this.store.get(uri);
	}

	getSymbolTable(uri: string): SymbolTable | undefined {
		return this.store.get(uri)?.symbolTable;
	}

	getAst(uri: string): ASTNode | undefined {
		return this.store.get(uri)?.ast;
	}

	getErrors(uri: string): CompilationError[] | undefined {
		return this.store.get(uri)?.errors;
	}

	delete(uri: string): void {
		this.store.delete(uri);
	}
}

export const documentStore = new DocumentStore();
