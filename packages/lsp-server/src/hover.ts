import type {
	Connection,
	TextDocuments,
	Hover,
	HoverParams,
} from "vscode-languageserver/node";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { documentStore } from "./document-store.js";
import { KEYWORD_DOCS } from "./keyword-docs.js";
import { getWordAtPosition } from "./utils.js";

export function register(connection: Connection, documents: TextDocuments<TextDocument>): void {
	connection.onHover((params: HoverParams): Hover | null => {
		return provideHover(params, documents);
	});
}

function provideHover(params: HoverParams, documents: TextDocuments<TextDocument>): Hover | null {
	const document = documents.get(params.textDocument.uri);
	if (!document) return null;

	const word = getWordAtPosition(document, params.position);
	if (!word) return null;

	// Built-in functions are lowercase keys; keywords are uppercase.
	const keywordDoc = KEYWORD_DOCS[word.toUpperCase()] ?? KEYWORD_DOCS[word];

	if (keywordDoc !== undefined) {
		return {
			contents: {
				kind: "markdown",
				value: keywordDoc.documentation
			}
		};
	}

	// 2. Check if it's a variable in the symbol table
	const table = documentStore.getSymbolTable(params.textDocument.uri);
	if (table) {
		const symbol = table.symbols.get(word);
		if (symbol) {
			return {
				contents: {
					kind: "markdown",
					value: `(variable) **${symbol.name}** : ${symbol.type}\n\nDéclarée à la ligne ${symbol.line}.`
				}
			};
		}
	}

	return null;
}
