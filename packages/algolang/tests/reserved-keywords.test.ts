import { test, expect } from "bun:test";
import { AlgoLangCompiler } from "../src/compiler";

test("Erreur - Mot-clé réservé utilisé comme nom de variable", async () => {
  const compiler = new AlgoLangCompiler();

  // Test avec seulement les mots-clés qui peuvent être testés comme variables
  // sans conflit immédiat avec la structure du programme
  const reservedKeywords = [
    "ENTIER", "REEL", "BOOLEEN", "CHAINE",
    "FINSI", "FINTANTQUE", "FINPOUR",
    "REPETER", "JUSQU'A", "A",
    "LIRE", "ECRIRE",
    "VRAI", "FAUX",
    "ET", "OU", "NON"
  ];

  for (const keyword of reservedKeywords) {
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
  }
});

test("Succès - Noms de variables valides", async () => {
  const compiler = new AlgoLangCompiler();

  const source = `
programme TestValide;
var
  nombre: entier;
  texte: chaine;
  drapeau: booleen;
  compteur: entier;
  resultat: entier;
debut
  nombre := 42;
  texte := "Bonjour";
  drapeau := vrai;
  compteur := 0;
  resultat := nombre + compteur;
  ecrire(resultat);
fin`;

  const result = compiler.compile(source);

  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
  expect(result.output).toContain("nombre = 42;");
  expect(result.output).toContain("texte = \"Bonjour\";");
  expect(result.output).toContain("drapeau = true;");
});

test("Erreur - Mot-clé dans une expression", async () => {
  const compiler = new AlgoLangCompiler();

  const source = `
programme TestExpression;
var
  x: entier;
  resultat: entier;
debut
  x := 10;
  resultat := x + pour; // 'pour' est un mot-clé réservé
  ecrire(resultat);
fin`;

  const result = compiler.compile(source);

  expect(result.success).toBe(false);
  expect(result.errors.length).toBeGreaterThan(0);

  const reservedKeywordError = result.errors.find((err: any) => err.code === "RESERVED_KEYWORD");
  expect(reservedKeywordError).toBeDefined();
  expect(reservedKeywordError?.message).toContain("'pour' est un mot-clé réservé");
});

test("Erreur - Fonction intégrée utilisée comme nom de variable", () => {
  const compiler = new AlgoLangCompiler();

  const builtins = ["abs", "max", "min", "mod", "racine_carree", "taille", "sous_chaine", "concat", "entier_en_reel", "reel_en_entier"];

  for (const name of builtins) {
    const source = `
programme TestBuiltin;
var
  ${name}: entier;
debut
  ${name} := 0
fin`;

    const result = compiler.compile(source);

    expect(result.success).toBe(false);
    const err = result.errors.find((e: any) => e.code === "BUILTIN_SHADOWING");
    expect(err).toBeDefined();
    expect(err?.message).toContain(`'${name}' est une fonction intégrée`);
    expect(err?.suggestion).toContain("Choisissez un autre nom");
  }
});

test("Erreur - Fonction intégrée utilisée dans un tableau", () => {
  const compiler = new AlgoLangCompiler();

  const source = `
programme TestBuiltinTab;
var
  taille: tableau[5] de entier;
debut
  taille[0] := 1
fin`;

  const result = compiler.compile(source);
  expect(result.success).toBe(false);
  const err = result.errors.find((e: any) => e.code === "BUILTIN_SHADOWING");
  expect(err).toBeDefined();
  expect(err?.message).toContain("'taille' est une fonction intégrée");
});

test("Succès - Noms similaires aux fonctions intégrées mais valides", () => {
  const compiler = new AlgoLangCompiler();

  const source = `
programme TestSimilaireBuiltin;
var
  absValeur: entier;
  maxTemp: entier;
debut
  absValeur := 5;
  maxTemp := 10;
  ecrire(absValeur, maxTemp)
fin`;

  const result = compiler.compile(source);
  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
});

test("Succès - Noms similaires mais valides", async () => {
  const compiler = new AlgoLangCompiler();

  const source = `
programme TestSimilaire;
var
  nombrePour: entier;
  valeurSi: entier;
  compteurPour: entier;
debut
  nombrePour := 10;
  valeurSi := 20;
  compteurPour := nombrePour + valeurSi;
  ecrire(compteurPour);
fin`;

  const result = compiler.compile(source);

  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
  expect(result.output).toContain("nombrePour = 10;");
  expect(result.output).toContain("valeurSi = 20;");
});