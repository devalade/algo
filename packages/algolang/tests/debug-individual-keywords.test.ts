import { test, expect } from "bun:test";
import { AlgoLangCompiler } from "../src/compiler";

const reservedKeywords = [
  "ENTIER", "REEL", "BOOLEEN", "CHAINE",
  "FINSI", "FINTANTQUE", "FINPOUR",
  "REPETER", "JUSQU'A", "A",
  "LIRE", "ECRIRE",
  "VRAI", "FAUX",
  "ET", "OU", "NON"
];

for (const keyword of reservedKeywords) {
  test(`Erreur - Mot-clé réservé '${keyword}' utilisé comme nom de variable`, async () => {
    const compiler = new AlgoLangCompiler();

    const source = `
programme TestErreur;
var
  ${keyword}: entier;
debut
  ${keyword} := 10;
  ecrire(${keyword});
fin`;

    const result = compiler.compile(source);

    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);

    // Vérifier que l'erreur contient le bon code d'erreur
    const reservedKeywordError = result.errors.find((err: any) => err.code === "RESERVED_KEYWORD");
    expect(reservedKeywordError).toBeDefined();
    expect(reservedKeywordError?.message).toContain(`'${keyword}' est un mot-clé réservé`);
    expect(reservedKeywordError?.explanation).toContain("mots-clés réservés");
    expect(reservedKeywordError?.suggestion).toContain("Choisissez un autre nom");
  });
}