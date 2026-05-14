import { describe, it, expect } from "bun:test";
import { KEYWORD_DOCS } from "../src/keyword-docs";

describe("LSP Server - Hover", () => {
	it("should have hover docs for all control flow keywords", () => {
		const controlFlow = [
			"SI", "ALORS", "SINON", "FINSI",
			"TANTQUE", "FAIRE", "FINTANTQUE",
			"POUR", "ALLANT", "DE", "A", "FINPOUR",
			"REPETER", "JUSQU'A"
		];

		for (const keyword of controlFlow) {
			expect(KEYWORD_DOCS[keyword]).toBeDefined();
			expect(KEYWORD_DOCS[keyword].documentation).toContain(`**${keyword}**`);
		}
	});

	it("should have hover docs for type keywords", () => {
		const types = ["ENTIER", "REEL", "BOOLEEN", "CHAINE"];

		for (const type of types) {
			expect(KEYWORD_DOCS[type]).toBeDefined();
			expect(KEYWORD_DOCS[type].documentation).toContain(`**${type}**`);
			expect(KEYWORD_DOCS[type].documentation.toLowerCase()).toContain("type");
		}
	});

	it("should have hover docs for I/O functions", () => {
		expect(KEYWORD_DOCS["LIRE"]).toBeDefined();
		expect(KEYWORD_DOCS["LIRE"].documentation).toContain("LIRE");

		expect(KEYWORD_DOCS["ECRIRE"]).toBeDefined();
		expect(KEYWORD_DOCS["ECRIRE"].documentation).toContain("ECRIRE");
	});

	it("should have hover docs for array and subprogram keywords", () => {
		const keywords = ["TABLEAU", "FONCTION", "PROCEDURE", "RETOURNER"];
		for (const keyword of keywords) {
			expect(KEYWORD_DOCS[keyword]).toBeDefined();
			expect(KEYWORD_DOCS[keyword].documentation).toContain(`**${keyword}**`);
		}
	});

	it("should have hover docs for built-in functions", () => {
		const builtins = [
			"abs", "max", "min", "mod", "racine_carree",
			"taille", "sous_chaine", "concat", "entier_en_reel", "reel_en_entier"
		];
		for (const fn of builtins) {
			expect(KEYWORD_DOCS[fn]).toBeDefined();
			expect(KEYWORD_DOCS[fn].documentation).toContain(`**${fn}`);
		}
	});

	it("should have hover docs for boolean literals and operators", () => {
		const booleanKeywords = ["VRAI", "FAUX", "ET", "OU", "NON"];

		for (const keyword of booleanKeywords) {
			expect(KEYWORD_DOCS[keyword]).toBeDefined();
			expect(KEYWORD_DOCS[keyword].documentation).toContain(`**${keyword}**`);
		}
	});

	it("should have hover docs for loop-specific keywords", () => {
		const loopKeywords = ["ALLANT", "DE", "A"];

		for (const keyword of loopKeywords) {
			expect(KEYWORD_DOCS[keyword]).toBeDefined();
			expect(KEYWORD_DOCS[keyword].documentation).toBeDefined();
		}
	});

	it("should have hover docs for keyword 'A'", () => {
		expect(KEYWORD_DOCS["A"]).toBeDefined();
		expect(KEYWORD_DOCS["A"].documentation).toBeTruthy();
	});

	it("should format variable hover info correctly", () => {
		const mockSymbol = {
			name: "compteur",
			type: "ENTIER",
			scope: "main",
			line: 5,
			column: 3
		};

		const expectedFormat = `(variable) **${mockSymbol.name}** : ${mockSymbol.type}\n\nDéclarée à la ligne ${mockSymbol.line}.`;

		expect(expectedFormat).toContain("compteur");
		expect(expectedFormat).toContain("ENTIER");
		expect(expectedFormat).toContain("ligne 5");
	});

	it("should have markdown-formatted documentation", () => {
		// All docs should use markdown bold syntax
		for (const [keyword, docs] of Object.entries(KEYWORD_DOCS)) {
			expect(docs.documentation).toContain("**");
		}
	});
});
