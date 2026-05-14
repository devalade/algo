import type {
	Connection,
	TextDocuments,
	DocumentFormattingParams,
	TextEdit,
} from "vscode-languageserver/node";
import type { TextDocument } from "vscode-languageserver-textdocument";

export function register(connection: Connection, documents: TextDocuments<TextDocument>): void {
	connection.onDocumentFormatting((params: DocumentFormattingParams): TextEdit[] => {
		return formatDocument(params, documents);
	});
}

function formatDocument(params: DocumentFormattingParams, documents: TextDocuments<TextDocument>): TextEdit[] {
	const document = documents.get(params.textDocument.uri);
	if (!document) return [];

	const text = document.getText();
	const formatted = formatAlgoLangSource(text, params.options.tabSize || 2);

	return [
		{
			range: {
				start: { line: 0, character: 0 },
				end: { line: document.lineCount, character: 0 }
			},
			newText: formatted
		}
	];
}

export function formatAlgoLangSource(text: string, tabSize: number): string {
	const lines = text.split(/\r?\n/);
	let indentLevel = 0;
	const indent = " ".repeat(tabSize);

	const formattedLines = lines.map(line => {
		const trimmed = line.trim();
		if (!trimmed) return "";

		// Decrease indent for closing keywords
		if (trimmed.match(/^(DEBUT|FIN|FINSI|FINTANTQUE|FINPOUR|SINON)\b/i)) {
			indentLevel = Math.max(0, indentLevel - 1);
		}

		if (trimmed.match(/^JUSQUA\b/i)) {
			indentLevel = Math.max(0, indentLevel - 1);
		}

		const newLine = indent.repeat(indentLevel) + trimmed;

		if (trimmed.match(/^(VAR|DEBUT|SI|SINON|REPETER)\b/i)) {
			indentLevel++;
		}

		if (trimmed.match(/^(TANTQUE|POUR)\b.*\bFAIRE\b/i)) {
			indentLevel++;
		}

		if (trimmed.match(/^FAIRE\b/i)) {
			indentLevel++;
		}

		return newLine;
	});

	return formattedLines.join("\n") + "\n";
}
