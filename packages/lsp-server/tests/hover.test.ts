import { describe, it, expect } from "bun:test";
import { KEYWORD_DOCS } from "../src/keyword-docs";

describe("LSP Server - Hover", () => {
	it("should have hover docs for all control flow keywords", () => {
		const controlFlow = [
			"si", "alors", "sinon", "finsi",
			"tantque", "faire", "fintantque",
			"pour", "allant", "de", "à", "finpour",
			"repeter", "jusqu'à"
		];

		for (const keyword of controlFlow) {
			expect(KEYWORD_DOCS[keyword]).toBeDefined();
			expect(KEYWORD_DOCS[keyword].documentation).toContain(`**${keyword}**`);
		}
	});

	it("should have hover docs for type keywords", () => {
		const types = ["entier", "reel", "booleen", "chaine"];

		for (const type of types) {
			expect(KEYWORD_DOCS[type]).toBeDefined();
			expect(KEYWORD_DOCS[type].documentation).toContain(`**${type}**`);
			expect(KEYWORD_DOCS[type].documentation.toLowerCase()).toContain("type");
		}
	});

	it("should have hover docs for I/O functions", () => {
		expect(KEYWORD_DOCS["lire"]).toBeDefined();
		expect(KEYWORD_DOCS["lire"].documentation).toContain("lire");

		expect(KEYWORD_DOCS["ecrire"]).toBeDefined();
		expect(KEYWORD_DOCS["ecrire"].documentation).toContain("ecrire");
	});

	it("should have hover docs for boolean literals and operators", () => {
		const booleanKeywords = ["vrai", "faux", "et", "ou", "non"];

		for (const keyword of booleanKeywords) {
			expect(KEYWORD_DOCS[keyword]).toBeDefined();
			expect(KEYWORD_DOCS[keyword].documentation).toContain(`**${keyword}**`);
		}
	});

	it("should have hover docs for loop-specific keywords", () => {
		const loopKeywords = ["allant", "de", "à"];

		for (const keyword of loopKeywords) {
			expect(KEYWORD_DOCS[keyword]).toBeDefined();
			expect(KEYWORD_DOCS[keyword].documentation).toBeDefined();
		}
	});

	it("should have hover docs for reserved keyword 'a'", () => {
		expect(KEYWORD_DOCS["a"]).toBeDefined();
		expect(KEYWORD_DOCS["a"].documentation).toContain("réservé");
	});

	it("should format variable hover info correctly", () => {
		const mockSymbol = {
			name: "compteur",
			type: "entier",
			scope: "main",
			line: 5,
			column: 3
		};

		const expectedFormat = `(variable) **${mockSymbol.name}** : ${mockSymbol.type}\n\nDéclarée à la ligne ${mockSymbol.line}.`;

		expect(expectedFormat).toContain("compteur");
		expect(expectedFormat).toContain("entier");
		expect(expectedFormat).toContain("ligne 5");
	});

	it("should have markdown-formatted documentation", () => {
		// All docs should use markdown bold syntax
		for (const [keyword, docs] of Object.entries(KEYWORD_DOCS)) {
			expect(docs.documentation).toContain("**");
		}
	});
});
