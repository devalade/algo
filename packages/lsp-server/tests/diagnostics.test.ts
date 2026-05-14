import { describe, it, expect } from "bun:test";
import { TextDocument } from "vscode-languageserver-textdocument";
import { computeErrorEndCharacter } from "../src/utils";

describe("LSP Server - Diagnostics", () => {
	it("should compute end character for word errors", () => {
		const doc = TextDocument.create("file://test.algo", "algolang", 1, "programme Test\ndebutt\nfin");

		// Error at "debugt" (typo) - line 1, column 0
		const endChar = computeErrorEndCharacter(doc, 1, 0);

		// Should span the entire word "debugt" (6 characters)
		expect(endChar).toBe(6);
	});

	it("should compute end character for single-character errors", () => {
		const doc = TextDocument.create("file://test.algo", "algolang", 1, "x := @ + 5");

		// Error at "@" - line 0, column 5
		const endChar = computeErrorEndCharacter(doc, 0, 5);

		// Should just be 1 character
		expect(endChar).toBe(6);
	});

	it("should compute end character for operator errors", () => {
		const doc = TextDocument.create("file://test.algo", "algolang", 1, "x :== 5");

		// Error at ":==" - line 0, column 2
		const endChar = computeErrorEndCharacter(doc, 0, 2);

		// Should span the operator sequence
		expect(endChar).toBeGreaterThan(2);
	});

	it("should handle end-of-line errors", () => {
		const doc = TextDocument.create("file://test.algo", "algolang", 1, "PROGRAMME");

		// Error at end of line
		const endChar = computeErrorEndCharacter(doc, 0, 9);

		// Should be at least one character
		expect(endChar).toBeGreaterThanOrEqual(10);
	});

	it("should handle identifier with accents", () => {
		const doc = TextDocument.create("file://test.algo", "algolang", 1, "JUSQU'A 10");

		// Error at "JUSQU'A"
		const endChar = computeErrorEndCharacter(doc, 0, 0);

		expect(endChar).toBe(7);
	});

	it("should handle invalid line gracefully", () => {
		const doc = TextDocument.create("file://test.algo", "algolang", 1, "PROGRAMME Test");

		// Error at non-existent line
		const endChar = computeErrorEndCharacter(doc, 99, 0);

		// Should return fallback
		expect(endChar).toBe(1);
	});

	it("should handle identifiers with numbers", () => {
		const doc = TextDocument.create("file://test.algo", "algolang", 1, "var x123: entier");

		// Error at "x123"
		const endChar = computeErrorEndCharacter(doc, 0, 4);

		// Should span "x123"
		expect(endChar).toBe(8);
	});

	it("should handle comparison operators", () => {
		const doc = TextDocument.create("file://test.algo", "algolang", 1, "si x >= 10 alors");

		// Error at ">="
		const endChar = computeErrorEndCharacter(doc, 0, 5);

		// Should span ">="
		expect(endChar).toBe(7);
	});

	it("should fallback to 1 char for unknown characters", () => {
		const doc = TextDocument.create("file://test.algo", "algolang", 1, "x := (5 + 3)");

		// Error at "("
		const endChar = computeErrorEndCharacter(doc, 0, 5);

		// Should be 1 character
		expect(endChar).toBe(6);
	});
});
