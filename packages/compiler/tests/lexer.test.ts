import { test, expect } from "bun:test";
import { Lexer } from "../src/lexer/lexer";
import { TokenType } from "../src/types";

test("Lexer - Tokenize basic keywords", () => {
  const lexer = new Lexer("programme debut fin var entier reel booleen chaine");
  const tokens = lexer.tokenize();

  expect(tokens).toHaveLength(9); // 8 keywords + EOF

  expect(tokens[0].type).toBe(TokenType.PROGRAM);
  expect(tokens[0].value).toBe("programme");

  expect(tokens[1].type).toBe(TokenType.BEGIN);
  expect(tokens[1].value).toBe("debut");

  expect(tokens[2].type).toBe(TokenType.END);
  expect(tokens[2].value).toBe("fin");

  expect(tokens[3].type).toBe(TokenType.VAR);
  expect(tokens[3].value).toBe("var");

  expect(tokens[4].type).toBe(TokenType.INTEGER);
  expect(tokens[4].value).toBe("entier");

  expect(tokens[5].type).toBe(TokenType.REAL);
  expect(tokens[5].value).toBe("reel");

  expect(tokens[6].type).toBe(TokenType.BOOLEAN);
  expect(tokens[6].value).toBe("booleen");

  expect(tokens[7].type).toBe(TokenType.STRING);
  expect(tokens[7].value).toBe("chaine");
});

test("Lexer - Tokenize control flow keywords", () => {
  const lexer = new Lexer("si alors sinon tantque faire pour à repeter jusqu'à lire ecrire vrai faux et ou non finpour finsi fintantque");
  const tokens = lexer.tokenize();

  const expectedTokens = [
    TokenType.IF, TokenType.THEN, TokenType.ELSE, TokenType.WHILE, TokenType.DO,
    TokenType.FOR, TokenType.TO, TokenType.REPEAT, TokenType.UNTIL, TokenType.READ,
    TokenType.WRITE, TokenType.TRUE, TokenType.FALSE, TokenType.AND, TokenType.OR,
    TokenType.NOT, TokenType.ENDFOR, TokenType.ENDIF, TokenType.ENDWHILE, TokenType.EOF
  ];

  expect(tokens).toHaveLength(expectedTokens.length);

  expectedTokens.forEach((expectedType, index) => {
    expect(tokens[index].type).toBe(expectedType);
  });
});

test("Lexer - Tokenize numbers", () => {
  const lexer = new Lexer("42 3.14 0 123.456");
  const tokens = lexer.tokenize();

  expect(tokens).toHaveLength(5); // 4 numbers + EOF

  expect(tokens[0].type).toBe(TokenType.NUMBER);
  expect(tokens[0].value).toBe("42");

  expect(tokens[1].type).toBe(TokenType.NUMBER);
  expect(tokens[1].value).toBe("3.14");

  expect(tokens[2].type).toBe(TokenType.NUMBER);
  expect(tokens[2].value).toBe("0");

  expect(tokens[3].type).toBe(TokenType.NUMBER);
  expect(tokens[3].value).toBe("123.456");
});

test("Lexer - Tokenize strings", () => {
  const lexer = new Lexer('"Bonjour le monde" "AlgoLang" ""');
  const tokens = lexer.tokenize();

  expect(tokens).toHaveLength(4); // 3 strings + EOF

  expect(tokens[0].type).toBe(TokenType.STRING_LITERAL);
  expect(tokens[0].value).toBe("Bonjour le monde");

  expect(tokens[1].type).toBe(TokenType.STRING_LITERAL);
  expect(tokens[1].value).toBe("AlgoLang");

  expect(tokens[2].type).toBe(TokenType.STRING_LITERAL);
  expect(tokens[2].value).toBe("");
});

test("Lexer - Tokenize string with escape sequences", () => {
  const lexer = new Lexer('"Hello\\nWorld\\tTab\\rCarriage\\nReturn"');
  const tokens = lexer.tokenize();

  expect(tokens).toHaveLength(2); // 1 string + EOF

  expect(tokens[0].type).toBe(TokenType.STRING_LITERAL);
  expect(tokens[0].value).toBe("Hello\nWorld\tTab\rCarriage\nReturn");
});

test("Lexer - Tokenize identifiers", () => {
  const lexer = new Lexer("variable1 ma_variable VariableName _underscore l'étudiant");
  const tokens = lexer.tokenize();

  expect(tokens).toHaveLength(6); // 5 identifiers + EOF

  tokens.slice(0, 5).forEach((token) => {
    expect(token.type).toBe(TokenType.IDENTIFIER);
  });

  expect(tokens[0].value).toBe("variable1");
  expect(tokens[1].value).toBe("ma_variable");
  expect(tokens[2].value).toBe("VariableName");
  expect(tokens[3].value).toBe("_underscore");
  expect(tokens[4].value).toBe("l'étudiant");
});

test("Lexer - Tokenize operators", () => {
  const lexer = new Lexer("+ - * / := = <> < <= > >=");
  const tokens = lexer.tokenize();

  const expectedTokens = [
    TokenType.PLUS, TokenType.MINUS, TokenType.MULTIPLY, TokenType.DIVIDE,
    TokenType.ASSIGN, TokenType.EQUAL, TokenType.NOT_EQUAL, TokenType.LESS_THAN,
    TokenType.LESS_EQUAL, TokenType.GREATER_THAN, TokenType.GREATER_EQUAL,
    TokenType.EOF
  ];

  expect(tokens).toHaveLength(expectedTokens.length);

  expectedTokens.forEach((expectedType, index) => {
    expect(tokens[index].type).toBe(expectedType);
  });
});

test("Lexer - Tokenize delimiters", () => {
  const lexer = new Lexer("; : , . ( )");
  const tokens = lexer.tokenize();

  const expectedTokens = [
    TokenType.SEMICOLON, TokenType.COLON, TokenType.COMMA, TokenType.DOT,
    TokenType.LEFT_PAREN, TokenType.RIGHT_PAREN, TokenType.EOF
  ];

  expect(tokens).toHaveLength(expectedTokens.length);

  expectedTokens.forEach((expectedType, index) => {
    expect(tokens[index].type).toBe(expectedType);
  });
});

test("Lexer - Handle line comments", () => {
  const lexer = new Lexer("x := 5; // Ceci est un commentaire\ny := 10;");
  const tokens = lexer.tokenize();

  // Comments should be filtered out
  const nonCommentTokens = tokens.filter(t => t.type !== TokenType.COMMENT);

  expect(nonCommentTokens).toHaveLength(9); // x := 5 ; y := 10 ; EOF
  expect(nonCommentTokens[0].value).toBe("x");
  expect(nonCommentTokens[1].value).toBe(":=");
  expect(nonCommentTokens[2].value).toBe("5");
  expect(nonCommentTokens[3].value).toBe(";");
  expect(nonCommentTokens[4].value).toBe("y");
  expect(nonCommentTokens[5].value).toBe(":=");
  expect(nonCommentTokens[6].value).toBe("10");
});

test("Lexer - Handle block comments", () => {
  const lexer = new Lexer("x := 5; /* Ceci est un\ncommentaire multiligne */ y := 10;");
  const tokens = lexer.tokenize();

  // Comments should be filtered out
  const nonCommentTokens = tokens.filter(t => t.type !== TokenType.COMMENT);

  expect(nonCommentTokens).toHaveLength(9); // x := 5 ; y := 10 ; EOF
  expect(nonCommentTokens[0].value).toBe("x");
  expect(nonCommentTokens[1].value).toBe(":=");
  expect(nonCommentTokens[2].value).toBe("5");
  expect(nonCommentTokens[3].value).toBe(";");
  expect(nonCommentTokens[4].value).toBe("y");
  expect(nonCommentTokens[5].value).toBe(":=");
  expect(nonCommentTokens[6].value).toBe("10");
});

test("Lexer - Track line and column numbers", () => {
  const source = `programme Test;
var
  x: entier;
debut
  x := 5;
fin.`;
  const lexer = new Lexer(source);
  const tokens = lexer.tokenize();

  // Check first line
  expect(tokens[0].line).toBe(1);
  expect(tokens[0].column).toBe(1);

  // Check second line (var)
  expect(tokens[3].line).toBe(2);
  expect(tokens[3].column).toBe(1);

  // Check variable declaration
  expect(tokens[4].line).toBe(3);
  expect(tokens[4].column).toBe(3);
});

test("Lexer - Handle whitespace and newlines", () => {
  const lexer = new Lexer("\n  \t  programme  \n  debut  \t fin\n");
  const tokens = lexer.tokenize();

  expect(tokens).toHaveLength(5); // programme debut fin EOF + NEWLINE
  expect(tokens[0].type).toBe(TokenType.PROGRAM);
  expect(tokens[1].type).toBe(TokenType.BEGIN);
  expect(tokens[2].type).toBe(TokenType.END);
  expect(tokens[3].type).toBe(TokenType.EOF);
});

test("Lexer - Error on unrecognized character", () => {
  const lexer = new Lexer("x @ 5");

  expect(() => lexer.tokenize()).toThrow(
    "Caractère non reconnu '@' à la ligne 1, colonne 2"
  );
});

test("Lexer - Error on unterminated string", () => {
  const lexer = new Lexer('"Ceci est une chaîne non terminée');

  expect(() => lexer.tokenize()).toThrow(
    "Chaîne de caractères non terminée à la ligne 1, colonne 1"
  );
});

test("Lexer - Error on invalid number format", () => {
  const lexer = new Lexer("3.14.15");

  expect(() => lexer.tokenize()).toThrow(
    "Nombre invalide: trop de points décimaux à la ligne 1, colonne 1"
  );
});

test("Lexer - Error on unterminated block comment", () => {
  const lexer = new Lexer("x := 5; /* commentaire non terminé");

  expect(() => lexer.tokenize()).toThrow(
    "Commentaire bloc non terminé commençant à la ligne 1, colonne 29"
  );
});

test("Lexer - Complex program tokenization", () => {
  const source = `programme Calculatrice;
var
  a, b, resultat: entier;
debut
  lire(a);
  lire(b);
  resultat := a + b;
  si resultat > 10 alors
    ecrire("Grand");
  sinon
    ecrire("Petit");
  finsi;
fin.`;

  const lexer = new Lexer(source);
  const tokens = lexer.tokenize();

  // Should successfully tokenize the entire program
  expect(tokens.length).toBeGreaterThan(20);
  expect(tokens[tokens.length - 1].type).toBe(TokenType.EOF);

  // Check some key tokens
  const programToken = tokens.find(t => t.type === TokenType.PROGRAM);
  expect(programToken).toBeDefined();
  expect(programToken?.value).toBe("programme");

  const varToken = tokens.find(t => t.type === TokenType.VAR);
  expect(varToken).toBeDefined();
  expect(varToken?.value).toBe("var");

  const assignToken = tokens.find(t => t.type === TokenType.ASSIGN);
  expect(assignToken).toBeDefined();
  expect(assignToken?.value).toBe(":=");

  const ifToken = tokens.find(t => t.type === TokenType.IF);
  expect(ifToken).toBeDefined();
  expect(ifToken?.value).toBe("si");
});

test("Lexer - Empty input", () => {
  const lexer = new Lexer("");
  const tokens = lexer.tokenize();

  expect(tokens).toHaveLength(1);
  expect(tokens[0].type).toBe(TokenType.EOF);
});

test("Lexer - Only whitespace", () => {
  const lexer = new Lexer("   \n\t  \n  ");
  const tokens = lexer.tokenize();

  expect(tokens.length).toBeGreaterThanOrEqual(1); // Should have at least EOF
  expect(tokens[tokens.length - 1].type).toBe(TokenType.EOF);
});