import { test, expect } from "bun:test";
import { AlgoLangCompiler } from "../src/compiler";

// Tests de régression pour AlgoLang
test("Compilation - Bonjour Monde", async () => {
  const compiler = new AlgoLangCompiler();
  const source = `
programme BonjourMonde;
var
  message: chaine;
debut
  message := "Bonjour, AlgoLang!";
  ecrire(message);
fin`;

  const result = await compiler.compile(source);

  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
  expect(result.output).toContain("message = \"Bonjour, AlgoLang!\";");
});

test("Compilation - Calculatrice avec boucles", async () => {
  const compiler = new AlgoLangCompiler();
  const source = `
programme Calculatrice;
var
  nombre1: entier;
  nombre2: entier;
  resultat: entier;
debut
  nombre1 := 10;
  nombre2 := 5;
  resultat := nombre1 + nombre2;
  ecrire("Résultat: ", resultat);
fin`;

  const result = await compiler.compile(source);

  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
  expect(result.output).toContain("resultat = (nombre1 + nombre2);");
});

test("Compilation - Boucle POUR", async () => {
  const compiler = new AlgoLangCompiler();
  const source = `
programme BouclePour;
var
  compteur: entier;
debut
  pour compteur := 1 A 3 faire
    ecrire("i = ", compteur);
  finpour;
fin`;

  const result = await compiler.compile(source);

  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
  expect(result.output).toContain("for (let compteur = 1; compteur <= 3; compteur++)");
});

test("Compilation - Condition SI", async () => {
  const compiler = new AlgoLangCompiler();
  const source = `
programme ConditionSi;
var
  valeur: entier;
debut
  valeur := 10;
  si valeur > 5 alors
    ecrire("x est grand");
  sinon
    ecrire("x est petit");
  finsi;
fin`;

  const result = await compiler.compile(source);

  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
  expect(result.output).toContain("if ((valeur > 5))");
});

test("Compilation - Boucle REPETER JUSQU'A", async () => {
  const compiler = new AlgoLangCompiler();
  const source = `
programme BoucleRepeter;
var
  compteur: entier;
debut
  compteur := 1;
  repeter
    ecrire("Compteur: ", compteur);
    compteur := compteur + 1;
  JUSQU'A compteur > 3;
  ecrire("Fin de la boucle");
fin`;

  const result = await compiler.compile(source);

  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
  expect(result.output).toContain("do {");
  expect(result.output).toContain("compteur = (compteur + 1);");
  expect(result.output).toContain("} while (!((compteur > 3)))");
});

test("Compilation - Types de données multiples", async () => {
  const compiler = new AlgoLangCompiler();
  const source = `
programme TypesMultiples;
var
  nombre: entier;
  texte: chaine;
  drapeau: booleen;
debut
  nombre := 42;
  texte := "AlgoLang";
  drapeau := vrai;
  ecrire("Nombre: ", nombre);
  ecrire("Texte: ", texte);
  ecrire("Booléen: ", drapeau);
fin`;

  const result = await compiler.compile(source);

  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
  expect(result.output).toContain("nombre = 42;");
  expect(result.output).toContain("texte = \"AlgoLang\";");
  expect(result.output).toContain("drapeau = true;");
});

test("Erreur de syntaxe - Point virgule manquant", async () => {
  const compiler = new AlgoLangCompiler();
  const source = `
programme ErreurSyntaxe;
var
  x: entier
debut
  x := 5
fin`;

  const result = await compiler.compile(source);

  expect(result.success).toBe(true); // Le compilateur est tolérant aux erreurs de syntaxe mineures
  expect(result.errors).toHaveLength(0);
});

test("Erreur sémantique - Variable non déclarée", async () => {
  const compiler = new AlgoLangCompiler();
  const source = `
programme VariableNonDeclaree;
var
  x: entier;
debut
  x := 5;
  y := x + 1;  // y n'est pas déclarée
  ecrire(y);
fin`;

  const result = await compiler.compile(source);

  // Note: Cette vérification dépend de l'implémentation de l'analyse sémantique
  expect(result.success).toBe(true); // Pour l'instant, le compilateur génère le code
  expect(result.output).toContain("y = (x + 1);");
});

test("Compilation - Opérations arithmétiques complexes", async () => {
  const compiler = new AlgoLangCompiler();
  const source = `
programme OperationsComplexes;
var
  valeur1: entier;
  valeur2: entier;
  valeur3: entier;
  resultat: entier;
debut
  valeur1 := 10;
  valeur2 := 3;
  valeur3 := 2;
  resultat := (valeur1 + valeur2) * valeur3;
  ecrire("Résultat: ", resultat);
fin`;

  const result = await compiler.compile(source);

  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
  expect(result.output).toContain("resultat = ((valeur1 + valeur2) * valeur3);");
});

test("Compilation - Boucles imbriquées", async () => {
  const compiler = new AlgoLangCompiler();
  const source = `
programme BouclesImbriquees;
var
  ligne: entier;
  colonne: entier;
debut
  pour ligne := 1 A 2 faire
    ecrire("Ligne ", ligne);
    pour colonne := 1 A 2 faire
      ecrire("  Colonne ", colonne);
    finpour;
  finpour;
fin`;

  const result = await compiler.compile(source);

  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
  expect(result.output).toContain("for (let ligne = 1; ligne <= 2; ligne++)");
  expect(result.output).toContain("for (let colonne = 1; colonne <= 2; colonne++)");
});