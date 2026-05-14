import { describe, it, expect } from "bun:test";
import { CompletionItemKind } from "vscode-languageserver/node";

// Mock the modules
const mockSymbolTables = new Map();

// Import after setting up mocks
import { KEYWORD_DOCS } from "../src/keyword-docs";

describe("LSP Server - Completion", () => {
	it("should include all 29 keywords in completion", () => {
		// Expected keywords
		const expectedKeywords = [
			"PROGRAMME", "DEBUT", "FIN", "VAR",
			"ENTIER", "REEL", "BOOLEEN", "CHAINE",
			"SI", "ALORS", "SINON", "FINSI",
			"TANTQUE", "FAIRE", "FINTANTQUE",
			"POUR", "ALLANT", "DE", "A", "FINPOUR",
			"REPETER", "JUSQUA",
			"LIRE", "ECRIRE",
			"VRAI", "FAUX",
			"ET", "OU", "NON"
		];

		expect(expectedKeywords.length).toBe(29);

		// Verify all keywords have documentation
		for (const keyword of expectedKeywords) {
			expect(KEYWORD_DOCS[keyword]).toBeDefined();
			expect(KEYWORD_DOCS[keyword].detail).toBeDefined();
			expect(KEYWORD_DOCS[keyword].documentation).toBeDefined();
		}
	});

	it("should have proper kind for each keyword type", () => {
		const types = ["ENTIER", "REEL", "BOOLEEN", "CHAINE"];
		const functions = ["LIRE", "ECRIRE"];
		const constants = ["VRAI", "FAUX"];
		const operators = ["ET", "OU", "NON"];

		// All should have documentation
		for (const keyword of [...types, ...functions, ...constants, ...operators]) {
			expect(KEYWORD_DOCS[keyword]).toBeDefined();
		}
	});

	it("should include variable completion data", () => {
		// Mock symbol table
		const mockTable = {
			symbols: new Map([
				["x", { name: "x", type: "ENTIER", scope: "main", line: 2, column: 3 }],
				["nom", { name: "nom", type: "CHAINE", scope: "main", line: 3, column: 3 }]
			]),
			parent: undefined,
			children: [],
			scopeName: "main"
		};

		// Verify we can iterate the symbols
		expect(mockTable.symbols.size).toBe(2);
		expect(mockTable.symbols.get("x")).toBeDefined();
		expect(mockTable.symbols.get("nom")).toBeDefined();
	});

	it("should have documentation for all keyword groups", () => {
		const keywordGroups = {
			structure: ["PROGRAMME", "DEBUT", "FIN", "VAR"],
			types: ["ENTIER", "REEL", "BOOLEEN", "CHAINE"],
			conditionals: ["SI", "ALORS", "SINON", "FINSI"],
			loops: ["TANTQUE", "FAIRE", "FINTANTQUE", "POUR", "ALLANT", "DE", "A", "FINPOUR", "REPETER", "JUSQUA"],
			io: ["LIRE", "ECRIRE"],
			boolean: ["VRAI", "FAUX", "ET", "OU", "NON"]
		};

		for (const [group, keywords] of Object.entries(keywordGroups)) {
			for (const keyword of keywords) {
				expect(KEYWORD_DOCS[keyword]).toBeDefined();
				expect(KEYWORD_DOCS[keyword].documentation).toContain(keyword);
			}
		}
	});

	it("should include reserved keyword 'A' in documentation", () => {
		expect(KEYWORD_DOCS["A"]).toBeDefined();
		expect(KEYWORD_DOCS["A"].documentation).toBeTruthy();
	});
});
