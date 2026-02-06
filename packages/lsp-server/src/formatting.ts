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
		if (trimmed.match(/^(debut|fin|finsi|fintantque|finpour|sinon)\b/i)) {
			indentLevel = Math.max(0, indentLevel - 1);
		}

		// 'jusqu'à' closes 'repeter' block (no \b because of apostrophe)
		if (trimmed.match(/^jusqu'à/i)) {
			indentLevel = Math.max(0, indentLevel - 1);
		}

		const newLine = indent.repeat(indentLevel) + trimmed;

		// Increase indent after opening keywords
		// For tantque/pour: only increase if 'faire' is on the same line
		if (trimmed.match(/^(var|debut|si|sinon|repeter)\b/i)) {
			indentLevel++;
		}

		// Special handling for tantque/pour with faire
		if (trimmed.match(/^(tantque|pour)\b.*\bfaire\b/i)) {
			indentLevel++;
		}

		// 'faire' on its own line increases indent
		if (trimmed.match(/^faire\b/i)) {
			indentLevel++;
		}

		return newLine;
	});

	return formattedLines.join("\n") + "\n";
}
