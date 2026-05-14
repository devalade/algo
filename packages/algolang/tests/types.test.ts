import { test, expect } from "bun:test";
import {
  TokenType,
  NodeType,
  DataType,
  type Token,
  type ASTNode,
  type SymbolTable,
  type SymbolInfo,
  type CompilationContext,
  type CompilationError,
  type CompilationWarning,
  type CompilerOptions,
  type CompiledOutput,
  type VariableInfo
} from "../src/types";

test("TokenType - Enum values", () => {
  // Test that all TokenType enum values exist
  expect(TokenType.PROGRAM).toBe("PROGRAMME");
  expect(TokenType.BEGIN).toBe("DEBUT");
  expect(TokenType.END).toBe("FIN");
  expect(TokenType.VAR).toBe("VAR");
  expect(TokenType.INTEGER).toBe("ENTIER");
  expect(TokenType.REAL).toBe("REEL");
  expect(TokenType.BOOLEAN).toBe("BOOLEEN");
  expect(TokenType.STRING).toBe("CHAINE");
  expect(TokenType.IF).toBe("SI");
  expect(TokenType.THEN).toBe("ALORS");
  expect(TokenType.ELSE).toBe("SINON");
  expect(TokenType.WHILE).toBe("TANTQUE");
  expect(TokenType.DO).toBe("FAIRE");
  expect(TokenType.FOR).toBe("POUR");
  expect(TokenType.TO).toBe("A");
  expect(TokenType.REPEAT).toBe("REPETER");
  expect(TokenType.UNTIL).toBe("JUSQU'A");
  expect(TokenType.READ).toBe("LIRE");
  expect(TokenType.WRITE).toBe("ECRIRE");
  expect(TokenType.TRUE).toBe("VRAI");
  expect(TokenType.FALSE).toBe("FAUX");
  expect(TokenType.AND).toBe("ET");
  expect(TokenType.OR).toBe("OU");
  expect(TokenType.NOT).toBe("NON");
  expect(TokenType.ENDFOR).toBe("FINPOUR");
  expect(TokenType.ENDIF).toBe("FINIF");
  expect(TokenType.ENDWHILE).toBe("FINTANTQUE");

  // Operators
  expect(TokenType.PLUS).toBe("PLUS");
  expect(TokenType.MINUS).toBe("MINUS");
  expect(TokenType.MULTIPLY).toBe("MULTIPLY");
  expect(TokenType.DIVIDE).toBe("DIVIDE");
  expect(TokenType.ASSIGN).toBe("ASSIGN");
  expect(TokenType.EQUAL).toBe("EQUAL");
  expect(TokenType.NOT_EQUAL).toBe("NOT_EQUAL");
  expect(TokenType.LESS_THAN).toBe("LESS_THAN");
  expect(TokenType.LESS_EQUAL).toBe("LESS_EQUAL");
  expect(TokenType.GREATER_THAN).toBe("GREATER_THAN");
  expect(TokenType.GREATER_EQUAL).toBe("GREATER_EQUAL");

  // Delimiters
  expect(TokenType.SEMICOLON).toBe("SEMICOLON");
  expect(TokenType.COLON).toBe("COLON");
  expect(TokenType.COMMA).toBe("COMMA");
  expect(TokenType.DOT).toBe("DOT");
  expect(TokenType.LEFT_PAREN).toBe("LEFT_PAREN");
  expect(TokenType.RIGHT_PAREN).toBe("RIGHT_PAREN");

  // Literals and identifiers
  expect(TokenType.NUMBER).toBe("NUMBER");
  expect(TokenType.IDENTIFIER).toBe("IDENTIFIER");
  expect(TokenType.STRING_LITERAL).toBe("STRING_LITERAL");

  // Special
  expect(TokenType.EOF).toBe("EOF");
  expect(TokenType.NEWLINE).toBe("NEWLINE");
  expect(TokenType.COMMENT).toBe("COMMENT");
});

test("NodeType - Enum values", () => {
  expect(NodeType.PROGRAM).toBe("PROGRAM");
  expect(NodeType.VAR_DECLARATION).toBe("VAR_DECLARATION");
  expect(NodeType.TYPE_SPECIFIER).toBe("TYPE_SPECIFIER");
  expect(NodeType.ASSIGNMENT).toBe("ASSIGNMENT");
  expect(NodeType.IF_STATEMENT).toBe("IF_STATEMENT");
  expect(NodeType.WHILE_STATEMENT).toBe("WHILE_STATEMENT");
  expect(NodeType.FOR_STATEMENT).toBe("FOR_STATEMENT");
  expect(NodeType.REPEAT_STATEMENT).toBe("REPEAT_STATEMENT");
  expect(NodeType.READ_STATEMENT).toBe("READ_STATEMENT");
  expect(NodeType.WRITE_STATEMENT).toBe("WRITE_STATEMENT");
  expect(NodeType.COMPOUND_STATEMENT).toBe("COMPOUND_STATEMENT");
  expect(NodeType.BINARY_OP).toBe("BINARY_OP");
  expect(NodeType.UNARY_OP).toBe("UNARY_OP");
  expect(NodeType.LITERAL).toBe("LITERAL");
  expect(NodeType.VARIABLE).toBe("VARIABLE");
  expect(NodeType.BLOCK).toBe("BLOCK");
  expect(NodeType.PARAMETER_LIST).toBe("PARAMETER_LIST");
});

test("DataType - Enum values", () => {
  expect(DataType.INTEGER).toBe("ENTIER");
  expect(DataType.REAL).toBe("REEL");
  expect(DataType.BOOLEAN).toBe("BOOLEEN");
  expect(DataType.STRING).toBe("CHAINE");
  expect(DataType.VOID).toBe("VIDE");
});

test("Token interface", () => {
  const token: Token = {
    type: TokenType.IDENTIFIER,
    value: "variable",
    line: 1,
    column: 5,
    position: 10
  };

  expect(token.type).toBe(TokenType.IDENTIFIER);
  expect(token.value).toBe("variable");
  expect(token.line).toBe(1);
  expect(token.column).toBe(5);
  expect(token.position).toBe(10);
});

test("ASTNode interface", () => {
  const astNode: ASTNode = {
    type: NodeType.LITERAL,
    value: 42,
    children: [],
    token: {
      type: TokenType.NUMBER,
      value: "42",
      line: 1,
      column: 1,
      position: 0
    },
    symbolInfo: {
      name: "const",
      type: "ENTIER",
      scope: "global",
      line: 1,
      column: 1
    }
  };

  expect(astNode.type).toBe(NodeType.LITERAL);
  expect(astNode.value).toBe(42);
  expect(astNode.children).toHaveLength(0);
  expect(astNode.token?.type).toBe(TokenType.NUMBER);
  expect(astNode.symbolInfo?.name).toBe("const");
});

test("SymbolInfo interface", () => {
  const symbolInfo: SymbolInfo = {
    name: "variable",
    type: "ENTIER",
    scope: "global",
    isConstant: true,
    initialValue: 10,
    line: 5,
    column: 10
  };

  expect(symbolInfo.name).toBe("variable");
  expect(symbolInfo.type).toBe("ENTIER");
  expect(symbolInfo.scope).toBe("global");
  expect(symbolInfo.isConstant).toBe(true);
  expect(symbolInfo.initialValue).toBe(10);
  expect(symbolInfo.line).toBe(5);
  expect(symbolInfo.column).toBe(10);
});

test("SymbolTable interface", () => {
  const symbols = new Map<string, SymbolInfo>();
  symbols.set("var1", {
    name: "var1",
    type: "ENTIER",
    scope: "global"
  });

  const symbolTable: SymbolTable = {
    symbols,
    parent: {
      symbols: new Map(),
      children: [],
      scopeName: "parent"
    },
    children: [],
    scopeName: "global"
  };

  expect(symbolTable.symbols.size).toBe(1);
  expect(symbolTable.symbols.has("var1")).toBe(true);
  expect(symbolTable.scopeName).toBe("global");
  expect(symbolTable.parent?.scopeName).toBe("parent");
  expect(symbolTable.children).toHaveLength(0);
});

test("VariableInfo interface", () => {
  const variableInfo: VariableInfo = {
    name: "testVariable",
    type: DataType.INTEGER,
    value: 25,
    isInitialized: true
  };

  expect(variableInfo.name).toBe("testVariable");
  expect(variableInfo.type).toBe(DataType.INTEGER);
  expect(variableInfo.value).toBe(25);
  expect(variableInfo.isInitialized).toBe(true);
});

test("CompilationContext interface", () => {
  const symbolTable: SymbolTable = {
    symbols: new Map(),
    children: [],
    scopeName: "global"
  };

  const compilationContext: CompilationContext = {
    sourceCode: "programme Test; debut fin",
    filePath: "test.algo",
    symbolTable,
    currentScope: symbolTable,
    errors: [],
    warnings: []
  };

  expect(compilationContext.sourceCode).toBe("programme Test; debut fin");
  expect(compilationContext.filePath).toBe("test.algo");
  expect(compilationContext.symbolTable).toBe(symbolTable);
  expect(compilationContext.currentScope).toBe(symbolTable);
  expect(compilationContext.errors).toHaveLength(0);
  expect(compilationContext.warnings).toHaveLength(0);
});

test("CompilationError interface", () => {
  const compilationError: CompilationError = {
    type: "ERROR",
    message: "Syntax error",
    line: 10,
    column: 15,
    position: 200,
    code: "SYNTAX_ERROR",
    explanation: "Invalid syntax in expression",
    suggestion: "Check your parentheses"
  };

  expect(compilationError.type).toBe("ERROR");
  expect(compilationError.message).toBe("Syntax error");
  expect(compilationError.line).toBe(10);
  expect(compilationError.column).toBe(15);
  expect(compilationError.position).toBe(200);
  expect(compilationError.code).toBe("SYNTAX_ERROR");
  expect(compilationError.explanation).toBe("Invalid syntax in expression");
  expect(compilationError.suggestion).toBe("Check your parentheses");
});

test("CompilationWarning interface", () => {
  const compilationWarning: CompilationWarning = {
    type: "WARNING",
    message: "Unused variable",
    line: 5,
    column: 8,
    position: 80,
    code: "UNUSED_VARIABLE"
  };

  expect(compilationWarning.type).toBe("WARNING");
  expect(compilationWarning.message).toBe("Unused variable");
  expect(compilationWarning.line).toBe(5);
  expect(compilationWarning.column).toBe(8);
  expect(compilationWarning.position).toBe(80);
  expect(compilationWarning.code).toBe("UNUSED_VARIABLE");
});

test("CompilerOptions interface", () => {
  const compilerOptions: CompilerOptions = {
    target: "javascript",
    optimizationLevel: 2,
    debugMode: true,
    pedagogicalMode: true,
    outputFilePath: "output.js"
  };

  expect(compilerOptions.target).toBe("javascript");
  expect(compilerOptions.optimizationLevel).toBe(2);
  expect(compilerOptions.debugMode).toBe(true);
  expect(compilerOptions.pedagogicalMode).toBe(true);
  expect(compilerOptions.outputFilePath).toBe("output.js");
});

test("CompiledOutput interface", () => {
  const errors: CompilationError[] = [];
  const warnings: CompilationWarning[] = [];
  const symbolTable: SymbolTable = {
    symbols: new Map(),
    children: [],
    scopeName: "global"
  };
  const ast: ASTNode = {
    type: NodeType.PROGRAM,
    value: "Test"
  };

  const compiledOutput: CompiledOutput = {
    success: true,
    output: "generated code",
    errors,
    warnings,
    executionTime: 150,
    memoryUsage: 1024,
    symbolTable,
    ast
  };

  expect(compiledOutput.success).toBe(true);
  expect(compiledOutput.output).toBe("generated code");
  expect(compiledOutput.errors).toHaveLength(0);
  expect(compiledOutput.warnings).toHaveLength(0);
  expect(compiledOutput.executionTime).toBe(150);
  expect(compiledOutput.memoryUsage).toBe(1024);
  expect(compiledOutput.symbolTable).toBe(symbolTable);
  expect(compiledOutput.ast).toBe(ast);
});

test("Type safety with optional properties", () => {
  const astNode: ASTNode = {
    type: NodeType.LITERAL,
    value: "test"
  };

  // Optional properties should be undefined when not provided
  expect(astNode.children).toBeUndefined();
  expect(astNode.token).toBeUndefined();
  expect(astNode.symbolInfo).toBeUndefined();
});

test("Type compatibility with enum values", () => {
  const token: Token = {
    type: TokenType.IDENTIFIER,
    value: "test",
    line: 1,
    column: 1,
    position: 0
  };

  const astNode: ASTNode = {
    type: NodeType.VARIABLE,
    value: "test",
    token
  };

  expect(astNode.token?.type).toBe(TokenType.IDENTIFIER);
});

test("Complex nested structures", () => {
  const symbolInfo: SymbolInfo = {
    name: "nestedVar",
    type: DataType.REAL,
    scope: "function",
    line: 20,
    column: 5
  };

  const symbols = new Map<string, SymbolInfo>();
  symbols.set("nestedVar", symbolInfo);

  const childSymbolTable: SymbolTable = {
    symbols: new Map(),
    children: [],
    scopeName: "child"
  };

  const parentSymbolTable: SymbolTable = {
    symbols,
    children: [childSymbolTable],
    scopeName: "parent"
  };

  const astNode: ASTNode = {
    type: NodeType.BINARY_OP,
    value: "+",
    children: [
      {
        type: NodeType.VARIABLE,
        value: "nestedVar",
        symbolInfo
      },
      {
        type: NodeType.LITERAL,
        value: 3.14,
        token: {
          type: TokenType.NUMBER,
          value: "3.14",
          line: 21,
          column: 10,
          position: 300
        }
      }
    ]
  };

  expect(astNode.type).toBe(NodeType.BINARY_OP);
  expect(astNode.value).toBe("+");
  expect(astNode.children).toHaveLength(2);
  expect(astNode.children![0].symbolInfo?.name).toBe("nestedVar");
  expect(astNode.children![1].value).toBe(3.14);
  expect(parentSymbolTable.children).toHaveLength(1);
  expect(parentSymbolTable.children![0].scopeName).toBe("child");
});

test("DataType type checking", () => {
  const variables: Record<string, VariableInfo> = {};

  variables.intVar = {
    name: "intVar",
    type: DataType.INTEGER,
    value: 42,
    isInitialized: true
  };

  variables.realVar = {
    name: "realVar",
    type: DataType.REAL,
    value: 3.14159,
    isInitialized: true
  };

  variables.boolVar = {
    name: "boolVar",
    type: DataType.BOOLEAN,
    value: true,
    isInitialized: true
  };

  variables.stringVar = {
    name: "stringVar",
    type: DataType.STRING,
    value: "Hello World",
    isInitialized: true
  };

  variables.voidVar = {
    name: "voidVar",
    type: DataType.VOID,
    isInitialized: false
  };

  expect(variables.intVar.type).toBe(DataType.INTEGER);
  expect(variables.realVar.type).toBe(DataType.REAL);
  expect(variables.boolVar.type).toBe(DataType.BOOLEAN);
  expect(variables.stringVar.type).toBe(DataType.STRING);
  expect(variables.voidVar.type).toBe(DataType.VOID);
});