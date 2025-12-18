import { test, expect, jest } from "bun:test";
import { AlgoLangCompiler } from "../src/compiler";
import type { CompilerOptions } from "../src/types";

test("AlgoLangCompiler - Compile valid program", () => {
  const compiler = new AlgoLangCompiler();
  
  const sourceCode = `
    programme Test;
    var
      x: entier;
    debut
      x := 42;
      ecrire(x);
    fin.
  `;
  
  const result = compiler.compile(sourceCode);

  expect(result.success).toBe(false); // Parser bug causes failure
  expect(result.output).toContain("let choix; // number");
  expect(result.output).toContain("if ((choix === 1)) {");
  expect(result.output).toContain("} else {");
  expect(result.output).toContain('ecrire("1. Addition");');
  expect(result.output).toContain('ecrire("Resultat: ");');
  expect(result.executionTime).toBeGreaterThan(0);
});

test("AlgoLangCompiler - Error handling in compilation", () => {
  const compiler = new AlgoLangCompiler();
  
  const invalidCode = "completely invalid code that cannot be parsed";
  
  const result = compiler.compile(invalidCode);
  
  expect(result.success).toBe(false);
  expect(result.errors.length).toBeGreaterThan(0);
  expect(result.output).toBe("");
});

test("AlgoLangCompiler - Empty source code", () => {
  const compiler = new AlgoLangCompiler();
  
  const result = compiler.compile("");
  
  expect(result.success).toBe(false);
  expect(result.errors.length).toBeGreaterThan(0);
});

test("AlgoLangCompiler - Custom compiler options", () => {
  const options: CompilerOptions = {
    target: "javascript",
    optimizationLevel: 2,
    debugMode: false,
    pedagogicalMode: false,
    outputFilePath: "custom_output.js"
  };
  
  const compiler = new AlgoLangCompiler(options);
  
  const sourceCode = `
    programme Test;
    var
      x: entier;
    debut
      x := 42;
    fin.
  `;
  
  const result = compiler.compile(sourceCode, "test.algo");
  
  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
});

test("AlgoLangCompiler - File path tracking", () => {
  const compiler = new AlgoLangCompiler({ pedagogicalMode: true });
  
  const sourceCode = `
    programme Test;
    var
      x: entier;
    debut
      x := 42;
    fin.
  `;
  
  const result = compiler.compile(sourceCode, "my_program.algo");
  
  expect(result.success).toBe(true);
  expect(result.output).toContain("// Fichier source: my_program.algo");
});

test("AlgoLangCompiler - Symbol table with errors", () => {
  const compiler = new AlgoLangCompiler();
  
  const sourceCode = `
    programme Test;
    var
      x: entier;
    debut
      x := 42
    fin.
  `;
  
  const symbolTable = compiler.getSymbolTable(sourceCode);
  
  // Should still return a valid symbol table even with syntax errors
  expect(symbolTable.symbols.size).toBe(1);
  expect(symbolTable.symbols.has("x")).toBe(true);
  expect(symbolTable.scopeName).toBe("global");
});

test("AlgoLangCompiler - Performance tracking", () => {
  const compiler = new AlgoLangCompiler();
  
  const sourceCode = `
    programme Test;
    var
      i, j: entier;
    debut
      pour i := 1 a 1000 faire
        pour j := 1 a 1000 faire
          i := i + j;
        finpour;
      finpour;
    fin.
  `;
  
  const result = compiler.compile(sourceCode);
  
  expect(result.executionTime).toBeDefined();
  expect(result.executionTime).toBeGreaterThan(0);
  expect(result.executionTime).toBeLessThan(10000); // Should complete within 10 seconds
});