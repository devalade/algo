#!/usr/bin/env bun
import { Lexer } from "./src/lexer/lexer";
import { Parser } from "./src/parser/parser";

const sourceCode = `programme CalculatriceAvancee;
var
  choix: entier;
  a: entier;
  b: entier;
  resultat: entier;
  continuer: booleen;
debut
  continuer := vrai;
  
  tantque continuer faire
    // Afficher le menu
    ecrire("");
    ecrire("CALCULATRICE AVANCÉE");
    ecrire("======================");
    ecrire("1. Addition");
    ecrire("2. Soustraction");
    ecrire("3. Multiplication");
    ecrire("4. Division");
    ecrire("5. Quitter");
    ecrire("Votre choix (1-5) : ");
    lire(choix);
    
    // Traiter le choix
    si choix = 5 alors
      continuer := faux;
      ecrire("Au revoir !");
    sinon si choix >= 1 et choix <= 4 alors
      // Demander les nombres
      ecrire("Premier nombre : ");
      lire(a);
      ecrire("Deuxième nombre : ");
      lire(b);
      
      // Effectuer l'opération
      si choix = 1 alors
        resultat := a + b;
        ecrire(a, " + ", b, " = ", resultat);
      sinon si choix = 2 alors
        resultat := a - b;
        ecrire(a, " - ", b, " = ", resultat);
      sinon si choix = 3 alors
        resultat := a * b;
        ecrire(a, " × ", b, " = ", resultat);
      sinon si choix = 4 alors
        si b <> 0 alors
          resultat := a / b;
          ecrire(a, " ÷ ", b, " = ", resultat);
        sinon
          ecrire("Erreur : Division par zéro !");
        finsi;
      finsi;
    sinon
      ecrire("Choix invalide !");
    finsi;
  fintantque;
fin.`;

console.log("Source code:", sourceCode);
console.log("\n=== TOKENIZATION ===");

try {
  const lexer = new Lexer(sourceCode);
  const tokens = lexer.tokenize();
  
  tokens.forEach((token, index) => {
    console.log(`${index}: ${token.type} = "${token.value}" (line ${token.line}, col ${token.column})`);
  });
  
  console.log("\n=== PARSING ===");
  
  const parser = new Parser(tokens);
  const result = parser.parse();
  
  console.log("Parsing successful!");
  console.log("Errors:", result.errors.length);
  result.errors.forEach(error => {
    console.log(`  - ${error.message} (line ${error.line}, col ${error.column})`);
  });
  
} catch (error) {
  console.error("Error:", error instanceof Error ? error.message : error);
  console.error("Stack:", error instanceof Error ? error.stack : "No stack");
}