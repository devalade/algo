#!/usr/bin/env bun
import { Lexer } from "./src/lexer/lexer";
import { Parser } from "./src/parser/parser";

const sourceCode = `programme Test;
var
  a: entier;
debut
  tantque a = 1 faire
    a := a + 1;
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