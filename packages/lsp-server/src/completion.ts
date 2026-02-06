import type {
	Connection,
	TextDocuments,
	CompletionItem,
	TextDocumentPositionParams,
} from "vscode-languageserver/node";
import { CompletionItemKind } from "vscode-languageserver/node";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { symbolTables } from "./cache.js";
import { KEYWORD_DOCS } from "./keyword-docs.js";

export function register(connection: Connection, documents: TextDocuments<TextDocument>): void {
	connection.onCompletion((params: TextDocumentPositionParams): CompletionItem[] => {
		return getCompletionItems(params, documents);
	});

	connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
		return resolveCompletionItem(item);
	});
}

function getCompletionItems(params: TextDocumentPositionParams, documents: TextDocuments<TextDocument>): CompletionItem[] {
	const items: CompletionItem[] = [];

	// D1: Add all keywords (including missing ones: fintantque, finpour, et, ou, non)
	const keywords = [
		{ label: "programme", kind: CompletionItemKind.Keyword },
		{ label: "debut", kind: CompletionItemKind.Keyword },
		{ label: "fin", kind: CompletionItemKind.Keyword },
		{ label: "var", kind: CompletionItemKind.Keyword },
		{ label: "entier", kind: CompletionItemKind.Class },
		{ label: "reel", kind: CompletionItemKind.Class },
		{ label: "booleen", kind: CompletionItemKind.Class },
		{ label: "chaine", kind: CompletionItemKind.Class },
		{ label: "si", kind: CompletionItemKind.Keyword },
		{ label: "alors", kind: CompletionItemKind.Keyword },
		{ label: "sinon", kind: CompletionItemKind.Keyword },
		{ label: "finsi", kind: CompletionItemKind.Keyword },
		{ label: "tantque", kind: CompletionItemKind.Keyword },
		{ label: "faire", kind: CompletionItemKind.Keyword },
		{ label: "fintantque", kind: CompletionItemKind.Keyword },
		{ label: "pour", kind: CompletionItemKind.Keyword },
		{ label: "allant", kind: CompletionItemKind.Keyword },
		{ label: "de", kind: CompletionItemKind.Keyword },
		{ label: "à", kind: CompletionItemKind.Keyword },
		{ label: "finpour", kind: CompletionItemKind.Keyword },
		{ label: "repeter", kind: CompletionItemKind.Keyword },
		{ label: "jusqu'à", kind: CompletionItemKind.Keyword },
		{ label: "lire", kind: CompletionItemKind.Function },
		{ label: "ecrire", kind: CompletionItemKind.Function },
		{ label: "vrai", kind: CompletionItemKind.Constant },
		{ label: "faux", kind: CompletionItemKind.Constant },
		{ label: "et", kind: CompletionItemKind.Operator },
		{ label: "ou", kind: CompletionItemKind.Operator },
		{ label: "non", kind: CompletionItemKind.Operator },
	];

	items.push(...keywords);

	// D2: Variable completion from symbol table
	const table = symbolTables.get(params.textDocument.uri);
	if (table) {
		for (const [name, symbol] of table.symbols) {
			items.push({
				label: name,
				kind: CompletionItemKind.Variable,
				detail: symbol.type,
			});
		}
	}

	return items;
}

function resolveCompletionItem(item: CompletionItem): CompletionItem {
	// D3: Complete onCompletionResolve for all keywords
	const keyword = item.label.toLowerCase();
	const docs = KEYWORD_DOCS[keyword];

	if (docs) {
		item.detail = docs.detail;
		item.documentation = docs.documentation;
	}

	return item;
}
