import type { TextDocument } from "vscode-languageserver-textdocument";
import type { Position } from "vscode-languageserver/node";

export function getWordAtPosition(document: TextDocument, position: Position): string | null {
	const text = document.getText();
	const lines = text.split(/\r?\n/);
	const lineText = lines[position.line];
	if (!lineText) return null;

	// Trouver le mot sous le curseur
	const wordMatch = lineText.slice(0, position.character).match(/[a-zA-Zàéèîïôûù'0-9_]*$/);
	const wordRestMatch = lineText.slice(position.character).match(/^[a-zA-Zàéèîïôûù'0-9_]*/);
	if (!wordMatch || !wordRestMatch) return null;

	const word = wordMatch[0] + wordRestMatch[0];
	return word || null;
}

export function computeErrorEndCharacter(document: TextDocument, line: number, column: number): number {
	const text = document.getText();
	const lines = text.split(/\r?\n/);
	const lineText = lines[line];
	if (!lineText) return column + 1;

	// Scan from (line, column) to find word/operator boundary
	let endChar = column;
	const char = lineText[column];

	if (!char) return column + 1;

	// If it's an identifier/keyword character, scan until non-identifier
	if (/[a-zA-Zàéèîïôûù'0-9_]/.test(char)) {
		while (endChar < lineText.length && /[a-zA-Zàéèîïôûù'0-9_]/.test(lineText[endChar])) {
			endChar++;
		}
	}
	// If it's an operator character, scan operators
	else if (/[+\-*/<>=:!]/.test(char)) {
		while (endChar < lineText.length && /[+\-*/<>=:!]/.test(lineText[endChar])) {
			endChar++;
		}
	}
	// Otherwise, just highlight the single character
	else {
		endChar = column + 1;
	}

	return endChar;
}
