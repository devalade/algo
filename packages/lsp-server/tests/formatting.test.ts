import { describe, it, expect } from "bun:test";
import { formatAlgoLangSource } from "../src/formatting";

describe("LSP Server - Formatting", () => {
	it("should indent tantque...faire block correctly", () => {
		const input = `programme Test
debut
tantque x < 10 faire
ecrire(x)
fintantque
fin`;

		const expected = `programme Test
debut
  tantque x < 10 faire
    ecrire(x)
  fintantque
fin
`;

		expect(formatAlgoLangSource(input, 2)).toBe(expected);
	});

	it("should indent pour...faire block correctly", () => {
		const input = `programme Test
debut
pour i allant de 1 à 10 faire
ecrire(i)
finpour
fin`;

		const expected = `programme Test
debut
  pour i allant de 1 à 10 faire
    ecrire(i)
  finpour
fin
`;

		expect(formatAlgoLangSource(input, 2)).toBe(expected);
	});

	it("should handle nested blocks correctly", () => {
		const input = `programme Test
debut
si x > 0 alors
tantque x < 10 faire
ecrire(x)
fintantque
sinon
ecrire("négatif")
finsi
fin`;

		const expected = `programme Test
debut
  si x > 0 alors
    tantque x < 10 faire
      ecrire(x)
    fintantque
  sinon
    ecrire("négatif")
  finsi
fin
`;

		expect(formatAlgoLangSource(input, 2)).toBe(expected);
	});

	it("should not double-indent with faire on own line", () => {
		const input = `programme Test
debut
tantque x < 10
faire
ecrire(x)
fintantque
fin`;

		// Even if 'faire' is on own line, it should not cause double-indent
		const expected = `programme Test
debut
  tantque x < 10
  faire
    ecrire(x)
  fintantque
fin
`;

		expect(formatAlgoLangSource(input, 2)).toBe(expected);
	});

	it("should handle var section correctly", () => {
		const input = `programme Test
var
x: entier
y: reel
debut
ecrire(x)
fin`;

		const expected = `programme Test
var
  x: entier
  y: reel
debut
  ecrire(x)
fin
`;

		expect(formatAlgoLangSource(input, 2)).toBe(expected);
	});

	it("should handle repeter...jusqu'à correctly", () => {
		const input = `programme Test
debut
repeter
ecrire(x)
x := x + 1
jusqu'à x = 10
fin`;

		const expected = `programme Test
debut
  repeter
    ecrire(x)
    x := x + 1
  jusqu'à x = 10
fin
`;

		expect(formatAlgoLangSource(input, 2)).toBe(expected);
	});

	it("should respect custom tab size", () => {
		const input = `programme Test
debut
ecrire("test")
fin`;

		const expected = `programme Test
debut
    ecrire("test")
fin
`;

		expect(formatAlgoLangSource(input, 4)).toBe(expected);
	});

	it("should preserve empty lines as empty", () => {
		const input = `programme Test
debut

ecrire("test")

fin`;

		const expected = `programme Test
debut

  ecrire("test")

fin
`;

		expect(formatAlgoLangSource(input, 2)).toBe(expected);
	});
});
