import type {
	Connection,
	TextDocuments,
	CompletionItem,
	TextDocumentPositionParams,
} from "vscode-languageserver/node";
import { CompletionItemKind } from "vscode-languageserver/node";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { KEYWORDS } from "@devalade/algolang";
import type { KeywordKind } from "@devalade/algolang";
import { documentStore } from "./document-store.js";
import { KEYWORD_DOCS } from "./keyword-docs.js";

const KIND_MAP: Record<KeywordKind, CompletionItemKind> = {
	control: CompletionItemKind.Keyword,
	type: CompletionItemKind.Class,
	io: CompletionItemKind.Function,
	operator: CompletionItemKind.Operator,
	literal: CompletionItemKind.Constant,
	declaration: CompletionItemKind.Keyword,
	"builtin-function": CompletionItemKind.Function,
};

const KEYWORD_COMPLETIONS: CompletionItem[] = Object.entries(KEYWORDS).map(
	([label, entry]) => ({ label, kind: KIND_MAP[entry.kind] }),
);

export function register(connection: Connection, documents: TextDocuments<TextDocument>): void {
	connection.onCompletion((params: TextDocumentPositionParams): CompletionItem[] => {
		return getCompletionItems(params, documents);
	});

	connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
		return resolveCompletionItem(item);
	});
}

function getCompletionItems(params: TextDocumentPositionParams, documents: TextDocuments<TextDocument>): CompletionItem[] {
	const items: CompletionItem[] = [...KEYWORD_COMPLETIONS];

	const table = documentStore.getSymbolTable(params.textDocument.uri);
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
	// Built-in functions are lowercase; keywords are uppercase. Check both.
	const docs = KEYWORD_DOCS[item.label.toUpperCase()] ?? KEYWORD_DOCS[item.label];
	if (docs) {
		item.detail = docs.detail;
		item.documentation = docs.documentation;
	}
	return item;
}
