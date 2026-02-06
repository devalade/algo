import { describe, it, expect } from "bun:test";
import { Lexer, Parser } from "@algolang/compiler";
import { formatAlgoLangSource } from "../src/formatting";
import { KEYWORD_DOCS } from "../src/keyword-docs";
import { getWordAtPosition, computeErrorEndCharacter } from "../src/utils";
import { TextDocument } from "vscode-languageserver-textdocument";

describe("LSP Server - Integration", () => {
	it("should handle a complete program end-to-end", () => {
		const source = `programme Calculatrice;
var
  x: entier;
  y: entier;
  resultat: entier;
debut
  ecrire("Entrez deux nombres:");
  lire(x);
  lire(y);

  si x > y alors
    resultat := x - y;
  sinon
    resultat := y - x;
  finsi;

  ecrire("Résultat:", resultat)
fin.`;

		// Test lexer and parser work
		const lexer = new Lexer(source);
		const tokens = lexer.tokenize();
		expect(tokens.length).toBeGreaterThan(0);

		const parser = new Parser(tokens);
		const result = parser.parse();
		expect(result.errors.length).toBe(0);
		expect(result.ast).toBeDefined();
		expect(result.symbolTable).toBeDefined();

		// Test symbol table has variables
		expect(result.symbolTable.symbols.size).toBeGreaterThanOrEqual(3);
		expect(result.symbolTable.symbols.has("x")).toBe(true);
		expect(result.symbolTable.symbols.has("y")).toBe(true);
		expect(result.symbolTable.symbols.has("resultat")).toBe(true);

		// Test formatter produces valid output
		const formatted = formatAlgoLangSource(source, 2);
		expect(formatted).toContain("programme Calculatrice");
		expect(formatted.split("\n").length).toBeGreaterThan(10);
	});

	it("should provide keyword documentation for all keywords", () => {
		const allKeywords = [
			"programme", "debut", "fin", "var",
			"entier", "reel", "booleen", "chaine",
			"si", "alors", "sinon", "finsi",
			"tantque", "faire", "fintantque",
			"pour", "allant", "de", "à", "a", "finpour",
			"repeter", "jusqu'à",
			"lire", "ecrire",
			"vrai", "faux",
			"et", "ou", "non"
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
			"programme Test\nvar x: entier"
		);

		// Get "programme" at position (0, 5)
		const word1 = getWordAtPosition(doc, { line: 0, character: 5 });
		expect(word1).toBe("programme");

		// Get "entier" at position (1, 10)
		const word2 = getWordAtPosition(doc, { line: 1, character: 10 });
		expect(word2).toBe("entier");

		// Get "x" at position (1, 4)
		const word3 = getWordAtPosition(doc, { line: 1, character: 4 });
		expect(word3).toBe("x");
	});

	it("should compute error ranges correctly", () => {
		const doc = TextDocument.create(
			"file://test.algo",
			"algolang",
			1,
			"programme Test\nvar x := 123"
		);

		// Error at "x" (position 1, 4)
		const end1 = computeErrorEndCharacter(doc, 1, 4);
		expect(end1).toBe(5); // "x" is 1 char

		// Error at ":=" (position 1, 6)
		const end2 = computeErrorEndCharacter(doc, 1, 6);
		expect(end2).toBe(8); // ":=" is 2 chars
	});

	it("should handle programs with errors", () => {
		const sourceWithError = `programme Test;
var
  x: entier;
debut
  si x > 10
    ecrire(x)
  finsi
fin.`;

		const lexer = new Lexer(sourceWithError);
		const tokens = lexer.tokenize();
		const parser = new Parser(tokens);
		const result = parser.parse();

		// Should have an error (missing 'alors')
		expect(result.errors.length).toBeGreaterThan(0);

		// Formatter should still work
		const formatted = formatAlgoLangSource(sourceWithError, 2);
		expect(formatted).toContain("programme Test");
	});

	it("should handle loop constructs correctly", () => {
		const loopSource = `programme Boucles;
var
  i: entier;
debut
  pour i allant de 1 à 10 faire
    ecrire(i);
  finpour;

  tantque i < 20 faire
    i := i + 1;
  fintantque;

  repeter
    i := i - 1
  jusqu'à i = 0
fin.`;

		const lexer = new Lexer(loopSource);
		const tokens = lexer.tokenize();
		const parser = new Parser(tokens);
		const result = parser.parse();

		expect(result.errors.length).toBe(0);

		// Test formatting maintains structure
		const formatted = formatAlgoLangSource(loopSource, 2);
		expect(formatted).toContain("pour i allant de 1 à 10 faire");
		expect(formatted).toContain("tantque i < 20 faire");
		expect(formatted).toContain("repeter");
		expect(formatted).toContain("jusqu'à i = 0");
	});
});
