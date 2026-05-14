import type {
	Connection,
	TextDocuments,
	Hover,
	HoverParams,
} from "vscode-languageserver/node";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { symbolTables } from "./cache.js";
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

	// 1. Check if it's a keyword (D4: add missing hover docs)
	const keyword = word.toUpperCase();
	const keywordDoc = KEYWORD_DOCS[keyword];

	if (keywordDoc) {
		return {
			contents: {
				kind: "markdown",
				value: keywordDoc.documentation
			}
		};
	}

	// 2. Check if it's a variable in the symbol table
	const table = symbolTables.get(params.textDocument.uri);
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
