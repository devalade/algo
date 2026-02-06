import type {
	Connection,
	TextDocuments,
	DefinitionParams,
	Location,
	DocumentSymbolParams,
	DocumentSymbol,
} from "vscode-languageserver/node";
import { SymbolKind } from "vscode-languageserver/node";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { symbolTables, documentAsts } from "./cache.js";
import { getWordAtPosition } from "./utils.js";

export function register(connection: Connection, documents: TextDocuments<TextDocument>): void {
	// E1: Go-to-definition
	connection.onDefinition((params: DefinitionParams): Location | null => {
		return provideDefinition(params, documents);
	});

	// E2: Document symbols
	connection.onDocumentSymbol((params: DocumentSymbolParams): DocumentSymbol[] => {
		return provideDocumentSymbols(params, documents);
	});
}

function provideDefinition(params: DefinitionParams, documents: TextDocuments<TextDocument>): Location | null {
	const document = documents.get(params.textDocument.uri);
	if (!document) return null;

	const word = getWordAtPosition(document, params.position);
	if (!word) return null;

	const table = symbolTables.get(params.textDocument.uri);
	if (!table) return null;

	const symbol = table.symbols.get(word);
	if (!symbol || symbol.line === undefined || symbol.column === undefined) return null;

	return {
		uri: params.textDocument.uri,
		range: {
			start: { line: symbol.line - 1, character: symbol.column - 1 },
			end: { line: symbol.line - 1, character: symbol.column - 1 + word.length }
		}
	};
}

function provideDocumentSymbols(params: DocumentSymbolParams, documents: TextDocuments<TextDocument>): DocumentSymbol[] {
	const document = documents.get(params.textDocument.uri);
	if (!document) return [];

	const table = symbolTables.get(params.textDocument.uri);
	const ast = documentAsts.get(params.textDocument.uri);

	const symbols: DocumentSymbol[] = [];

	// Add programme name if available from AST
	if (ast && ast.value) {
		const programmeName = String(ast.value);
		symbols.push({
			name: programmeName,
			kind: SymbolKind.Module,
			range: {
				start: { line: 0, character: 0 },
				end: { line: 0, character: programmeName.length }
			},
			selectionRange: {
				start: { line: 0, character: 0 },
				end: { line: 0, character: programmeName.length }
			}
		});
	}

	// Add all variables from symbol table
	if (table) {
		for (const [name, symbol] of table.symbols) {
			const line = (symbol.line || 1) - 1;
			const column = (symbol.column || 1) - 1;

			symbols.push({
				name: `${name}: ${symbol.type}`,
				kind: SymbolKind.Variable,
				range: {
					start: { line, character: column },
					end: { line, character: column + name.length }
				},
				selectionRange: {
					start: { line, character: column },
					end: { line, character: column + name.length }
				}
			});
		}
	}

	return symbols;
}
