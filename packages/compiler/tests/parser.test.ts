import { test, expect } from "bun:test";
import { Parser } from "../src/parser/parser";
import { Lexer } from "../src/lexer/lexer";
import { NodeType, DataType } from "../src/types";

function createParser(source: string): Parser {
  const lexer = new Lexer(source);
  const tokens = lexer.tokenize();
  return new Parser(tokens);
}

test("Parser - Parse basic program structure", () => {
  const parser = createParser("programme Test; debut fin");
  const result = parser.parse();

  expect(result.errors).toHaveLength(0);
  expect(result.ast.type).toBe(NodeType.PROGRAM);
  expect(result.ast.value).toBe("Test");
  expect(result.ast.children).toHaveLength(1);
  expect(result.ast.children![0].type).toBe(NodeType.BLOCK);
});

test("Parser - Parse simple variable declaration", () => {
  const parser = createParser(`
    programme Test;
    var
      x: entier;
    debut
    fin
  `);
  const result = parser.parse();

  expect(result.errors).toHaveLength(0);

  const block = result.ast.children![0];
  expect(block.children!.length).toBe(2); // VAR_DECLARATION + COMPOUND_STATEMENT

  const declarations = block.children![0];
  expect(declarations.type).toBe(NodeType.BLOCK);

  const varDeclarations = declarations.children!.filter(
    (child: any) => child.type === NodeType.VAR_DECLARATION
  );
  expect(varDeclarations).toHaveLength(1);

  // Check variable declaration
  expect(varDeclarations[0].value).toBe(DataType.INTEGER);
  expect(varDeclarations[0].children).toHaveLength(1);
  expect(varDeclarations[0].children![0].value).toBe("x");
});

test("Parser - Parse assignment statements", () => {
  const parser = createParser(`
    programme Test;
    var
      x: entier;
    debut
      x := 42;
    fin
  `);
  const result = parser.parse();

  expect(result.errors).toHaveLength(0);

  const block = result.ast.children![0];
  const compoundStatement = block.children![1];

  expect(compoundStatement.type).toBe(NodeType.COMPOUND_STATEMENT);
  expect(compoundStatement.children).toHaveLength(1);

  const assignment = compoundStatement.children![0];
  expect(assignment.type).toBe(NodeType.ASSIGNMENT);
  expect(assignment.children).toHaveLength(2);

  expect(assignment.children![0].type).toBe(NodeType.VARIABLE);
  expect(assignment.children![0].value).toBe("x");

  expect(assignment.children![1].type).toBe(NodeType.LITERAL);
  expect(assignment.children![1].value).toBe(42);
});

test("Parser - Parse multiple variable declarations", () => {
  const parser = createParser(`
    programme Test;
    var
      x, y, z: entier;
    debut
    fin
  `);
  const result = parser.parse();

  expect(result.errors).toHaveLength(0);

  const block = result.ast.children![0];
  const varDeclaration = block.children![0].children![0];

  expect(varDeclaration.type).toBe(NodeType.VAR_DECLARATION);
  expect(varDeclaration.value).toBe(DataType.INTEGER);
  expect(varDeclaration.children).toHaveLength(3);
  expect(varDeclaration.children![0].value).toBe("x");
  expect(varDeclaration.children![1].value).toBe("y");
  expect(varDeclaration.children![2].value).toBe("z");
});

test("Parser - Parse arithmetic expressions", () => {
  const parser = createParser(`
    programme Test;
    var
      x, y: entier;
    debut
      x := 1 + 2;
      y := x * 3;
    fin
  `);
  const result = parser.parse();

  expect(result.errors).toHaveLength(0);

  const compoundStatement = result.ast.children![0].children![1];
  expect(compoundStatement.children).toHaveLength(2);

  // Check first assignment
  const assignment1 = compoundStatement.children![0];
  const expr1 = assignment1.children![1];
  expect(expr1.type).toBe(NodeType.BINARY_OP);
  expect(expr1.value).toBe("+");

  // Check second assignment
  const assignment2 = compoundStatement.children![1];
  const expr2 = assignment2.children![1];
  expect(expr2.type).toBe(NodeType.BINARY_OP);
  expect(expr2.value).toBe("*");
});

test("Parser - Parse literals", () => {
  const parser = createParser(`
    programme Test;
    debut
      ecrire(42);
      ecrire(3.14);
      ecrire(vrai);
      ecrire(faux);
      ecrire("Hello");
    fin
  `);
  const result = parser.parse();

  expect(result.errors).toHaveLength(0);

  const compoundStatement = result.ast.children![0].children![1];
  expect(compoundStatement.children).toHaveLength(5);

  // Check each write statement contains a literal
  expect(compoundStatement.children[0].children![0].type).toBe(NodeType.LITERAL);
  expect(compoundStatement.children[0].children![0].value).toBe(42);

  expect(compoundStatement.children[1].children![0].type).toBe(NodeType.LITERAL);
  expect(compoundStatement.children[1].children![0].value).toBe(3.14);

  expect(compoundStatement.children[2].children![0].type).toBe(NodeType.LITERAL);
  expect(compoundStatement.children[2].children![0].value).toBe(true);

  expect(compoundStatement.children[3].children![0].type).toBe(NodeType.LITERAL);
  expect(compoundStatement.children[3].children![0].value).toBe(false);

  expect(compoundStatement.children[4].children![0].type).toBe(NodeType.LITERAL);
  expect(compoundStatement.children[4].children![0].value).toBe("Hello");
});

test("Parser - Error on missing program keyword", () => {
  const parser = createParser("Test; debut fin");
  const result = parser.parse();

  expect(result.errors.length).toBeGreaterThan(0);
  expect(result.errors[0].message).toContain('Le programme doit commencer par le mot-clé "programme"');
});

test("Parser - Error on missing semicolon after program name", () => {
  const parser = createParser("programme Test debut fin");
  const result = parser.parse();

  expect(result.errors.length).toBeGreaterThan(0);
  expect(result.errors[0].message).toContain("Le nom du programme doit être suivi d'un point-virgule");
});

test("Parser - Error on missing begin keyword", () => {
  const parser = createParser("programme Test; var x: entier; fin");
  const result = parser.parse();

  expect(result.errors.length).toBeGreaterThan(0);
});

test("Parser - Error on missing end keyword", () => {
  const parser = createParser("programme Test; debut x := 5;");
  const result = parser.parse();

  expect(result.errors.length).toBeGreaterThan(0);
});

test("Parser - Error on duplicate variable declaration", () => {
  const parser = createParser(`
    programme Test;
    var
      x: entier;
      x: reel;
    debut
    fin
  `);
  const result = parser.parse();

  expect(result.errors.length).toBeGreaterThan(0);
  expect(result.errors.some(e => e.code === "DUPLICATE_VARIABLE")).toBe(true);
  expect(result.errors.some(e => e.message.includes("x"))).toBe(true);
});

test("Parser - Reserved keyword as variable name", () => {
  const parser = createParser(`
    programme Test;
    var
      si: entier;
    debut
      si := 5;
    fin
  `);
  const result = parser.parse();

  expect(result.errors.length).toBeGreaterThan(0);
  expect(result.errors.some(e => e.code === "RESERVED_KEYWORD")).toBe(true);
  expect(result.errors.some(e => e.message.includes("si") && e.message.includes("mot-clé réservé"))).toBe(true);
});

// Skip complex control structures due to parser bugs
test("Parser - Parse if statements", () => {
  const parser = createParser(`
    programme Test;
    debut
      si vrai alors
        ecrire(1);
      sinon
        ecrire(2);
      finsi;
    fin
  `);
  const result = parser.parse();

  expect(result.errors).toHaveLength(0);

  const compoundStatement = result.ast.children![0].children![1];
  const ifStatement = compoundStatement.children![0];

  expect(ifStatement.type).toBe(NodeType.IF_STATEMENT);
  expect(ifStatement.children).toHaveLength(3); // condition, thenBranch, elseBranch

  expect(ifStatement.children![0].type).toBe(NodeType.LITERAL);
  expect(ifStatement.children![0].value).toBe(true);

  expect(ifStatement.children![1].type).toBe(NodeType.COMPOUND_STATEMENT);
  expect(ifStatement.children![2].type).toBe(NodeType.COMPOUND_STATEMENT);
});

test("Parser - Parse while statements", () => {
  const parser = createParser(`
    programme Test;
    debut
      tantque vrai faire
        ecrire(1);
      fintantque;
    fin
  `);
  const result = parser.parse();

  expect(result.errors).toHaveLength(0);
  const compoundStatement = result.ast.children![0].children![1];
  const whileStatement = compoundStatement.children![0];
  expect(whileStatement.type).toBe(NodeType.WHILE_STATEMENT);
});

test("Parser - Parse for statements", () => {
  const parser = createParser(`
    programme Test;
    var i: entier;
    debut
      pour i := 1 à 10 faire
        ecrire(i);
      finpour;
    fin
  `);
  const result = parser.parse();

  expect(result.errors).toHaveLength(0);
  const compoundStatement = result.ast.children![0].children![1];
  const forStatement = compoundStatement.children![0];
  expect(forStatement.type).toBe(NodeType.FOR_STATEMENT);
});

test("Parser - Parse repeat statements", () => {
  const parser = createParser(`
    programme Test;
    debut
      repeter
        ecrire(1);
      jusqu'à vrai;
    fin
  `);
  const result = parser.parse();

  expect(result.errors).toHaveLength(0);
  const compoundStatement = result.ast.children![0].children![1];
  const repeatStatement = compoundStatement.children![0];
  expect(repeatStatement.type).toBe(NodeType.REPEAT_STATEMENT);
});

test("Parser - Parse read/write statements", () => {
  const parser = createParser(`
    programme Test;
    var x: entier;
    debut
      lire(x);
      ecrire(x, " hello");
    fin
  `);
  const result = parser.parse();

  expect(result.errors).toHaveLength(0);
});

test("Parser - Parse logical expressions", () => {
  const parser = createParser(`
    programme Test;
    var res: booleen;
    debut
      res := vrai et faux ou non vrai;
    fin
  `);
  const result = parser.parse();

  expect(result.errors).toHaveLength(0);
});

test("Parser - Parse comparison expressions", () => {
  const parser = createParser(`
    programme Test;
    var res: booleen;
    debut
      res := 1 < 2 et 3 <= 4 ou 5 > 6 et 7 >= 8 ou 9 = 10 et 11 <> 12;
    fin
  `);
  const result = parser.parse();

  expect(result.errors).toHaveLength(0);
});

test("Parser - Nested control structures", () => {
  const parser = createParser(`
    programme Test;
    var i, j: entier;
    debut
      pour i := 1 à 10 faire
        si i > 5 alors
          tantque j < 5 faire
            j := j + 1;
          fintantque;
        finsi;
      finpour;
    fin
  `);
  const result = parser.parse();

  expect(result.errors).toHaveLength(0);
});