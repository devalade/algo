import { test, expect } from "bun:test";
import { AlgoLangCompiler } from "../src/compiler";

test("Debug single keyword", async () => {
  const compiler = new AlgoLangCompiler();
  
  const keyword = "entier";
  const source = `
programme TestErreur;
var
  ${keyword}: entier;
debut
  ${keyword} := 10;
  ecrire(${keyword});
fin.`;

  console.log("Testing keyword:", keyword);
  const result = compiler.compile(source);
  
  console.log("Success:", result.success);
  console.log("Errors length:", result.errors.length);
  console.log("Error codes:", result.errors.map(e => e.code));
  
  if (result.errors.length > 0) {
    const reservedKeywordError = result.errors.find(err => err.code === "RESERVED_KEYWORD");
    console.log("Reserved keyword error found:", !!reservedKeywordError);
    if (reservedKeywordError) {
      console.log("Error message:", reservedKeywordError.message);
    }
  }
  
  expect(result.success).toBe(false);
  expect(result.errors.length).toBeGreaterThan(0);
  
  // Vérifier que l'erreur contient le bon code d'erreur
  const reservedKeywordError = result.errors.find(err => err.code === "RESERVED_KEYWORD");
  expect(reservedKeywordError).toBeDefined();
  expect(reservedKeywordError?.message).toContain(`'${keyword}' est un mot-clé réservé`);
  expect(reservedKeywordError?.explanation).toContain("mots-clés réservés");
  expect(reservedKeywordError?.suggestion).toContain("Choisissez un autre nom");
});