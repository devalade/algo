import { describe, it, expect } from "bun:test";
import { AlgoFormatter } from "../src/formatting";
import { Lexer, Parser } from "@devalade/algolang";

function fmt(source: string, tabSize = 2): string {
	const result = new Parser(new Lexer(source).tokenize()).parse();
	expect(result.errors).toHaveLength(0);
	return new AlgoFormatter(tabSize).format(result.ast);
}

describe("AlgoFormatter - AST-driven formatting", () => {
	it("formats a minimal program", () => {
		const src = `PROGRAMME Test;\nDEBUT\nECRIRE("Bonjour");\nFIN`;
		const out = fmt(src);
		expect(out).toContain("PROGRAMME Test;");
		expect(out).toContain("DEBUT");
		expect(out).toContain('  ECRIRE("Bonjour");');
		expect(out).toContain("FIN");
	});

	it("formats VAR declarations", () => {
		const src = `PROGRAMME Test;\nVAR\nx: ENTIER;\ny: REEL;\nDEBUT\nFIN`;
		const out = fmt(src);
		expect(out).toContain("VAR");
		expect(out).toContain("  x: ENTIER;");
		expect(out).toContain("  y: REEL;");
	});

	it("formats array declaration", () => {
		const src = `PROGRAMME Test;\nVAR\nt: TABLEAU[5] DE ENTIER;\nDEBUT\nFIN`;
		const out = fmt(src);
		expect(out).toContain("  t: TABLEAU[5] DE ENTIER;");
	});

	it("formats SI...ALORS...FINSI", () => {
		const src = `PROGRAMME Test;\nVAR\nx: ENTIER;\nDEBUT\nSI x > 0 ALORS\nECRIRE(x)\nFINSI\nFIN`;
		const out = fmt(src);
		expect(out).toContain("  SI x > 0 ALORS");
		expect(out).toContain("    ECRIRE(x);");
		expect(out).toContain("  FINSI");
	});

	it("formats SI...SINON...FINSI", () => {
		const src = `PROGRAMME Test;\nVAR\nx: ENTIER;\nDEBUT\nSI x > 0 ALORS\nECRIRE("positif")\nSINON\nECRIRE("negatif")\nFINSI\nFIN`;
		const out = fmt(src);
		expect(out).toContain("  SINON");
		expect(out).toContain('    ECRIRE("negatif");');
		expect(out).toContain("  FINSI");
	});

	it("formats TANTQUE loop", () => {
		const src = `PROGRAMME Test;\nVAR\ni: ENTIER;\nDEBUT\ni := 0;\nTANTQUE i < 10 FAIRE\nECRIRE(i);\ni := i + 1\nFINTANTQUE\nFIN`;
		const out = fmt(src);
		expect(out).toContain("  TANTQUE i < 10 FAIRE");
		expect(out).toContain("    ECRIRE(i);");
		expect(out).toContain("    i := i + 1;");
		expect(out).toContain("  FINTANTQUE");
	});

	it("formats POUR loop", () => {
		const src = `PROGRAMME Test;\nVAR\ni: ENTIER;\nDEBUT\nPOUR i ALLANT DE 1 A 10 FAIRE\nECRIRE(i)\nFINPOUR\nFIN`;
		const out = fmt(src);
		expect(out).toContain("  POUR i ALLANT DE 1 A 10 FAIRE");
		expect(out).toContain("    ECRIRE(i);");
		expect(out).toContain("  FINPOUR");
	});

	it("formats REPETER loop", () => {
		const src = `PROGRAMME Test;\nVAR\nx: ENTIER;\nDEBUT\nx := 0;\nREPETER\nx := x + 1\nJUSQU'A x = 10\nFIN`;
		const out = fmt(src);
		expect(out).toContain("  REPETER");
		expect(out).toContain("    x := x + 1;");
		expect(out).toContain("  JUSQU'A x = 10");
	});

	it("formats LIRE statement", () => {
		const src = `PROGRAMME Test;\nVAR\nx: ENTIER;\nDEBUT\nLIRE(x)\nFIN`;
		const out = fmt(src);
		expect(out).toContain("  LIRE(x);");
	});

	it("formats assignment", () => {
		const src = `PROGRAMME Test;\nVAR\nx: ENTIER;\nDEBUT\nx := 42\nFIN`;
		const out = fmt(src);
		expect(out).toContain("  x := 42;");
	});

	it("formats boolean operators as uppercase", () => {
		const src = `PROGRAMME Test;\nVAR\nx, y: ENTIER;\nDEBUT\nx := 1;\nSI x > 0 ET y > 0 ALORS\nECRIRE("ok")\nFINSI\nFIN`;
		const out = fmt(src);
		expect(out).toContain("ET");
	});

	it("normalises VRAI/FAUX literals", () => {
		const src = `PROGRAMME Test;\nVAR\nok: BOOLEEN;\nDEBUT\nok := VRAI\nFIN`;
		const out = fmt(src);
		expect(out).toContain("ok := VRAI;");
	});

	it("formats function declaration before main body", () => {
		const src = `PROGRAMME Test;\nFONCTION carre(n: ENTIER): ENTIER\nDEBUT\nRETOURNER n * n\nFIN\nDEBUT\nECRIRE("ok")\nFIN`;
		const out = fmt(src);
		const fnIdx = out.indexOf("FONCTION carre");
		const mainIdx = out.indexOf("\nDEBUT\n");
		expect(fnIdx).toBeLessThan(mainIdx);
	});

	it("respects custom tab size", () => {
		const src = `PROGRAMME Test;\nVAR\nx: ENTIER;\nDEBUT\nECRIRE(x)\nFIN`;
		const out = fmt(src, 4);
		expect(out).toContain("    ECRIRE(x);");
	});

	it("does not misformat keywords inside strings", () => {
		// The string "DEBUT" should not trigger indent increase
		const src = `PROGRAMME Test;\nDEBUT\nECRIRE("DEBUT du programme")\nFIN`;
		const out = fmt(src);
		// Should have exactly 2 spaces indent, not 4
		expect(out).toContain('  ECRIRE("DEBUT du programme");');
	});
});
