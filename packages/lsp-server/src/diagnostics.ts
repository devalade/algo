import type {
	Connection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity as DiagSev,
} from "vscode-languageserver/node";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { DiagnosticSeverity } from "vscode-languageserver/node";
import { Lexer, Parser } from "@algolang/compiler";
import { symbolTables, documentAsts } from "./cache.js";
import { computeErrorEndCharacter } from "./utils.js";

let hasDiagnosticRelatedInformationCapability = false;

export function setDiagnosticCapability(value: boolean): void {
	hasDiagnosticRelatedInformationCapability = value;
}

export function register(connection: Connection, documents: TextDocuments<TextDocument>): void {
	documents.onDidChangeContent((change) => {
		validateTextDocument(change.document, connection);
	});
}

async function validateTextDocument(textDocument: TextDocument, connection: Connection): Promise<void> {
	const text = textDocument.getText();
	const diagnostics: Diagnostic[] = [];

	try {
		const lexer = new Lexer(text);
		const tokens = lexer.tokenize();
		const parser = new Parser(tokens);
		const result = parser.parse();

		// Store symbol table and AST for other features (A3: eliminate double-parse)
		symbolTables.set(textDocument.uri, result.symbolTable);
		documentAsts.set(textDocument.uri, result.ast);

		// Add parsing errors to diagnostics (A2: fix hardcoded error range)
		for (const error of result.errors) {
			const startLine = Math.max(0, error.line - 1);
			const startChar = Math.max(0, error.column - 1);
			const endChar = computeErrorEndCharacter(textDocument, startLine, startChar);

			const diagnostic: Diagnostic = {
				severity: DiagnosticSeverity.Error,
				range: {
					start: {
						line: startLine,
						character: startChar
					},
					end: {
						line: startLine,
						character: endChar
					},
				},
				message: error.message,
				source: "AlgoLang",
			};

			if (hasDiagnosticRelatedInformationCapability && error.explanation) {
				diagnostic.relatedInformation = [
					{
						location: {
							uri: textDocument.uri,
							range: Object.assign({}, diagnostic.range),
						},
						message: error.explanation,
					},
				];
			}
			diagnostics.push(diagnostic);
		}
	} catch (error: any) {
		// Catastrophic errors (lexer/parser crash)
		diagnostics.push({
			severity: DiagnosticSeverity.Error,
			range: {
				start: { line: 0, character: 0 },
				end: { line: 0, character: 1 },
			},
			message: error.message || "Erreur interne du serveur AlgoLang",
			source: "AlgoLang",
		});
	}

	// Send computed diagnostics to VS Code
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}
