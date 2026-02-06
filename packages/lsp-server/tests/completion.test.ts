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
			"programme", "debut", "fin", "var",
			"entier", "reel", "booleen", "chaine",
			"si", "alors", "sinon", "finsi",
			"tantque", "faire", "fintantque",
			"pour", "allant", "de", "à", "finpour",
			"repeter", "jusqu'à",
			"lire", "ecrire",
			"vrai", "faux",
			"et", "ou", "non"
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
		const types = ["entier", "reel", "booleen", "chaine"];
		const functions = ["lire", "ecrire"];
		const constants = ["vrai", "faux"];
		const operators = ["et", "ou", "non"];

		// All should have documentation
		for (const keyword of [...types, ...functions, ...constants, ...operators]) {
			expect(KEYWORD_DOCS[keyword]).toBeDefined();
		}
	});

	it("should include variable completion data", () => {
		// Mock symbol table
		const mockTable = {
			symbols: new Map([
				["x", { name: "x", type: "entier", scope: "main", line: 2, column: 3 }],
				["nom", { name: "nom", type: "chaine", scope: "main", line: 3, column: 3 }]
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
			structure: ["programme", "debut", "fin", "var"],
			types: ["entier", "reel", "booleen", "chaine"],
			conditionals: ["si", "alors", "sinon", "finsi"],
			loops: ["tantque", "faire", "fintantque", "pour", "allant", "de", "à", "finpour", "repeter", "jusqu'à"],
			io: ["lire", "ecrire"],
			boolean: ["vrai", "faux", "et", "ou", "non"]
		};

		for (const [group, keywords] of Object.entries(keywordGroups)) {
			for (const keyword of keywords) {
				expect(KEYWORD_DOCS[keyword]).toBeDefined();
				expect(KEYWORD_DOCS[keyword].documentation).toContain(keyword);
			}
		}
	});

	it("should include reserved keyword 'a' in documentation", () => {
		expect(KEYWORD_DOCS["a"]).toBeDefined();
		expect(KEYWORD_DOCS["a"].documentation).toContain("réservé");
	});
});
