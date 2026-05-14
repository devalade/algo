import { describe, it, expect } from "bun:test";
import { Lexer, Parser } from "@algolang/compiler";
import { formatAlgoLangSource } from "../src/formatting";
import { KEYWORD_DOCS } from "../src/keyword-docs";
import { getWordAtPosition, computeErrorEndCharacter } from "../src/utils";
import { TextDocument } from "vscode-languageserver-textdocument";

describe("LSP Server - Integration", () => {
	it("should handle a complete program end-to-end", () => {
		const source = `PROGRAMME Calculatrice;
VAR
  x: ENTIER;
  y: ENTIER;
  resultat: ENTIER;
DEBUT
  ECRIRE("Entrez deux nombres:");
  LIRE(x);
  LIRE(y);

  SI x > y ALORS
    resultat := x - y;
  SINON
    resultat := y - x;
  FINSI;

  ECRIRE("Résultat:", resultat)
FIN`;

		const lexer = new Lexer(source);
		const tokens = lexer.tokenize();
		expect(tokens.length).toBeGreaterThan(0);

		const parser = new Parser(tokens);
		const result = parser.parse();
		expect(result.errors.length).toBe(0);
		expect(result.ast).toBeDefined();
		expect(result.symbolTable).toBeDefined();

		expect(result.symbolTable.symbols.size).toBeGreaterThanOrEqual(3);
		expect(result.symbolTable.symbols.has("x")).toBe(true);
		expect(result.symbolTable.symbols.has("y")).toBe(true);
		expect(result.symbolTable.symbols.has("resultat")).toBe(true);

		const formatted = formatAlgoLangSource(source, 2);
		expect(formatted).toContain("PROGRAMME Calculatrice");
		expect(formatted.split("\n").length).toBeGreaterThan(10);
	});

	it("should provide keyword documentation for all keywords", () => {
		const allKeywords = [
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

		for (const keyword of allKeywords) {
			expect(KEYWORD_DOCS[keyword]).toBeDefined();
			expect(KEYWORD_DOCS[keyword].detail).toBeTruthy();
			expect(KEYWORD_DOCS[keyword].documentation).toBeTruthy();
		}
	});

	it("should extract word at position correctly", () => {
		const doc = TextDocument.create(
			"file://test.algo",
			"algolang",
			1,
			"PROGRAMME Test\nVAR x: ENTIER"
		);

		const word1 = getWordAtPosition(doc, { line: 0, character: 5 });
		expect(word1).toBe("PROGRAMME");

		const word2 = getWordAtPosition(doc, { line: 1, character: 10 });
		expect(word2).toBe("ENTIER");

		// Get "x" at position (1, 4)
		const word3 = getWordAtPosition(doc, { line: 1, character: 4 });
		expect(word3).toBe("x");
	});

	it("should compute error ranges correctly", () => {
		const doc = TextDocument.create(
			"file://test.algo",
			"algolang",
			1,
			"PROGRAMME Test\nVAR x := 123"
		);

		// Error at "x" (position 1, 4)
		const end1 = computeErrorEndCharacter(doc, 1, 4);
		expect(end1).toBe(5); // "x" is 1 char

		// Error at ":=" (position 1, 6)
		const end2 = computeErrorEndCharacter(doc, 1, 6);
		expect(end2).toBe(8); // ":=" is 2 chars
	});

	it("should handle programs with errors", () => {
		const sourceWithError = `PROGRAMME Test;
VAR
  x: ENTIER;
DEBUT
  SI x > 10
    ECRIRE(x)
  FINSI
FIN`;

		const lexer = new Lexer(sourceWithError);
		const tokens = lexer.tokenize();
		const parser = new Parser(tokens);
		const result = parser.parse();

		expect(result.errors.length).toBeGreaterThan(0);

		const formatted = formatAlgoLangSource(sourceWithError, 2);
		expect(formatted).toContain("PROGRAMME Test");
	});

	it("should handle loop constructs correctly", () => {
		const loopSource = `PROGRAMME Boucles;
VAR
  i: ENTIER;
DEBUT
  POUR i ALLANT DE 1 A 10 FAIRE
    ECRIRE(i);
  FINPOUR;

  TANTQUE i < 20 FAIRE
    i := i + 1;
  FINTANTQUE;

  REPETER
    i := i - 1
  JUSQUA i = 0
FIN`;

		const lexer = new Lexer(loopSource);
		const tokens = lexer.tokenize();
		const parser = new Parser(tokens);
		const result = parser.parse();

		expect(result.errors.length).toBe(0);

		const formatted = formatAlgoLangSource(loopSource, 2);
		expect(formatted).toContain("POUR i ALLANT DE 1 A 10 FAIRE");
		expect(formatted).toContain("TANTQUE i < 20 FAIRE");
		expect(formatted).toContain("REPETER");
		expect(formatted).toContain("JUSQUA i = 0");
	});
});
