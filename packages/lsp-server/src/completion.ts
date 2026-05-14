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
		{ label: "PROGRAMME", kind: CompletionItemKind.Keyword },
		{ label: "DEBUT", kind: CompletionItemKind.Keyword },
		{ label: "FIN", kind: CompletionItemKind.Keyword },
		{ label: "VAR", kind: CompletionItemKind.Keyword },
		{ label: "ENTIER", kind: CompletionItemKind.Class },
		{ label: "REEL", kind: CompletionItemKind.Class },
		{ label: "BOOLEEN", kind: CompletionItemKind.Class },
		{ label: "CHAINE", kind: CompletionItemKind.Class },
		{ label: "SI", kind: CompletionItemKind.Keyword },
		{ label: "ALORS", kind: CompletionItemKind.Keyword },
		{ label: "SINON", kind: CompletionItemKind.Keyword },
		{ label: "FINSI", kind: CompletionItemKind.Keyword },
		{ label: "TANTQUE", kind: CompletionItemKind.Keyword },
		{ label: "FAIRE", kind: CompletionItemKind.Keyword },
		{ label: "FINTANTQUE", kind: CompletionItemKind.Keyword },
		{ label: "POUR", kind: CompletionItemKind.Keyword },
		{ label: "ALLANT", kind: CompletionItemKind.Keyword },
		{ label: "DE", kind: CompletionItemKind.Keyword },
		{ label: "A", kind: CompletionItemKind.Keyword },
		{ label: "FINPOUR", kind: CompletionItemKind.Keyword },
		{ label: "REPETER", kind: CompletionItemKind.Keyword },
		{ label: "JUSQU'A", kind: CompletionItemKind.Keyword },
		{ label: "TABLEAU", kind: CompletionItemKind.Keyword },
		{ label: "FONCTION", kind: CompletionItemKind.Keyword },
		{ label: "PROCEDURE", kind: CompletionItemKind.Keyword },
		{ label: "RETOURNER", kind: CompletionItemKind.Keyword },
		{ label: "LIRE", kind: CompletionItemKind.Function },
		{ label: "ECRIRE", kind: CompletionItemKind.Function },
		{ label: "VRAI", kind: CompletionItemKind.Constant },
		{ label: "FAUX", kind: CompletionItemKind.Constant },
		{ label: "ET", kind: CompletionItemKind.Operator },
		{ label: "OU", kind: CompletionItemKind.Operator },
		{ label: "NON", kind: CompletionItemKind.Operator },
		// Fonctions intégrées (minuscules)
		{ label: "abs", kind: CompletionItemKind.Function },
		{ label: "max", kind: CompletionItemKind.Function },
		{ label: "min", kind: CompletionItemKind.Function },
		{ label: "mod", kind: CompletionItemKind.Function },
		{ label: "racine_carree", kind: CompletionItemKind.Function },
		{ label: "taille", kind: CompletionItemKind.Function },
		{ label: "sous_chaine", kind: CompletionItemKind.Function },
		{ label: "concat", kind: CompletionItemKind.Function },
		{ label: "entier_en_reel", kind: CompletionItemKind.Function },
		{ label: "reel_en_entier", kind: CompletionItemKind.Function },
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
	const keyword = item.label.toUpperCase();
	const docs = KEYWORD_DOCS[keyword];

	if (docs) {
		item.detail = docs.detail;
		item.documentation = docs.documentation;
	}

	return item;
}
