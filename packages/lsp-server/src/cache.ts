import type { SymbolTable, ASTNode } from "@devalade/algolang";

export const symbolTables = new Map<string, SymbolTable>();
export const documentAsts = new Map<string, ASTNode>();

export function clearDocumentCache(uri: string): void {
	symbolTables.delete(uri);
	documentAsts.delete(uri);
}
