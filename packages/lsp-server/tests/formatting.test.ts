import { describe, it, expect } from "bun:test";
import { formatAlgoLangSource } from "../src/formatting";

describe("LSP Server - Formatting", () => {
	it("should indent TANTQUE...FAIRE block correctly", () => {
		const input = `PROGRAMME Test
DEBUT
TANTQUE x < 10 FAIRE
ECRIRE(x)
FINTANTQUE
FIN`;

		const expected = `PROGRAMME Test
DEBUT
  TANTQUE x < 10 FAIRE
    ECRIRE(x)
  FINTANTQUE
FIN
`;

		expect(formatAlgoLangSource(input, 2)).toBe(expected);
	});

	it("should indent POUR...FAIRE block correctly", () => {
		const input = `PROGRAMME Test
DEBUT
POUR i ALLANT DE 1 A 10 FAIRE
ECRIRE(i)
FINPOUR
FIN`;

		const expected = `PROGRAMME Test
DEBUT
  POUR i ALLANT DE 1 A 10 FAIRE
    ECRIRE(i)
  FINPOUR
FIN
`;

		expect(formatAlgoLangSource(input, 2)).toBe(expected);
	});

	it("should handle nested blocks correctly", () => {
		const input = `PROGRAMME Test
DEBUT
SI x > 0 ALORS
TANTQUE x < 10 FAIRE
ECRIRE(x)
FINTANTQUE
SINON
ECRIRE("négatif")
FINSI
FIN`;

		const expected = `PROGRAMME Test
DEBUT
  SI x > 0 ALORS
    TANTQUE x < 10 FAIRE
      ECRIRE(x)
    FINTANTQUE
  SINON
    ECRIRE("négatif")
  FINSI
FIN
`;

		expect(formatAlgoLangSource(input, 2)).toBe(expected);
	});

	it("should not double-indent with FAIRE on own line", () => {
		const input = `PROGRAMME Test
DEBUT
TANTQUE x < 10
FAIRE
ECRIRE(x)
FINTANTQUE
FIN`;

		const expected = `PROGRAMME Test
DEBUT
  TANTQUE x < 10
  FAIRE
    ECRIRE(x)
  FINTANTQUE
FIN
`;

		expect(formatAlgoLangSource(input, 2)).toBe(expected);
	});

	it("should handle VAR section correctly", () => {
		const input = `PROGRAMME Test
VAR
x: ENTIER
y: REEL
DEBUT
ECRIRE(x)
FIN`;

		const expected = `PROGRAMME Test
VAR
  x: ENTIER
  y: REEL
DEBUT
  ECRIRE(x)
FIN
`;

		expect(formatAlgoLangSource(input, 2)).toBe(expected);
	});

	it("should handle REPETER...JUSQU'A correctly", () => {
		const input = `PROGRAMME Test
DEBUT
REPETER
ECRIRE(x)
x := x + 1
JUSQU'A x = 10
FIN`;

		const expected = `PROGRAMME Test
DEBUT
  REPETER
    ECRIRE(x)
    x := x + 1
  JUSQU'A x = 10
FIN
`;

		expect(formatAlgoLangSource(input, 2)).toBe(expected);
	});

	it("should respect custom tab size", () => {
		const input = `PROGRAMME Test
DEBUT
ECRIRE("test")
FIN`;

		const expected = `PROGRAMME Test
DEBUT
    ECRIRE("test")
FIN
`;

		expect(formatAlgoLangSource(input, 4)).toBe(expected);
	});

	it("should preserve empty lines as empty", () => {
		const input = `PROGRAMME Test
DEBUT

ECRIRE("test")

FIN`;

		const expected = `PROGRAMME Test
DEBUT

  ECRIRE("test")

FIN
`;

		expect(formatAlgoLangSource(input, 2)).toBe(expected);
	});
});
