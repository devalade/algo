import { test, expect } from "bun:test";
import { CodeGenerator } from "../src/codegen/codegen";
import { NodeType, DataType } from "../src/types";
import type { SymbolTable, ASTNode } from "../src/types";

function createMockSymbolTable(symbols: Record<string, { type: string; scope: string }> = {}): SymbolTable {
  const symbolMap = new Map();
  for (const [name, info] of Object.entries(symbols)) {
    symbolMap.set(name, {
      name,
      type: info.type,
      scope: info.scope,
      line: 1,
      column: 1
    });
  }
  
  return {
    symbols: symbolMap,
    children: [],
    scopeName: "global"
  };
}

function createMockAST(type: NodeType, value?: string | number, children?: ASTNode[]): ASTNode {
  return {
    type,
    value,
    children: children || []
  };
}

test("CodeGenerator - Generate basic program structure", () => {
  const symbolTable = createMockSymbolTable();
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST(NodeType.PROGRAM, "Test", [
    createMockAST(NodeType.BLOCK, undefined, [
      createMockAST(NodeType.VAR_DECLARATION, DataType.INTEGER, [
        createMockAST(NodeType.VARIABLE, "x")
      ]),
      createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
        createMockAST(NodeType.ASSIGNMENT, undefined, [
          createMockAST(NodeType.VARIABLE, "x"),
          createMockAST(NodeType.LITERAL, 42)
        ])
      ])
    ])
  ]);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
  expect(result.output).toContain("// Code généré par AlgoLang");
  expect(result.output).toContain('import * as readline from "readline";');
  expect(result.output).toContain("async function main()");
  expect(result.output).toContain("let x; // number");
  expect(result.output).toContain("x = 42;");
});

test("CodeGenerator - Generate multiple variable declarations", () => {
  const symbolTable = createMockSymbolTable({
    "a": { type: DataType.INTEGER, scope: "global" },
    "b": { type: DataType.REAL, scope: "global" },
    "c": { type: DataType.BOOLEAN, scope: "global" },
    "d": { type: DataType.STRING, scope: "global" }
  });
  
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST(NodeType.PROGRAM, "Test", [
    createMockAST(NodeType.BLOCK, undefined, [
      createMockAST(NodeType.VAR_DECLARATION, DataType.INTEGER, [
        createMockAST(NodeType.VARIABLE, "a"),
        createMockAST(NodeType.VARIABLE, "b")
      ]),
      createMockAST(NodeType.VAR_DECLARATION, DataType.BOOLEAN, [
        createMockAST(NodeType.VARIABLE, "c")
      ]),
      createMockAST(NodeType.VAR_DECLARATION, DataType.STRING, [
        createMockAST(NodeType.VARIABLE, "d")
      ])
    ])
  ]);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(true);
  expect(result.output).toContain("let a, b; // number");
  expect(result.output).toContain("let c; // boolean");
  expect(result.output).toContain("let d; // string");
});

test("CodeGenerator - Generate if statements", () => {
  const symbolTable = createMockSymbolTable({ "x": { type: DataType.INTEGER, scope: "global" } });
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST(NodeType.PROGRAM, "Test", [
    createMockAST(NodeType.BLOCK, undefined, [
      createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
        createMockAST(NodeType.IF_STATEMENT, undefined, [
          createMockAST(NodeType.BINARY_OP, ">", [
            createMockAST(NodeType.VARIABLE, "x"),
            createMockAST(NodeType.LITERAL, 0)
          ]),
          createMockAST(NodeType.ASSIGNMENT, undefined, [
            createMockAST(NodeType.VARIABLE, "x"),
            createMockAST(NodeType.LITERAL, 1)
          ])
        ])
      ])
    ])
  ]);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(true);
  expect(result.output).toContain("if ((x > 0)) {");
  expect(result.output).toContain("x = 1;");
});

test("CodeGenerator - Generate if-else statements", () => {
  const symbolTable = createMockSymbolTable({ "x": { type: DataType.INTEGER, scope: "global" } });
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST(NodeType.PROGRAM, "Test", [
    createMockAST(NodeType.BLOCK, undefined, [
      createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
        createMockAST(NodeType.IF_STATEMENT, undefined, [
          createMockAST(NodeType.BINARY_OP, ">", [
            createMockAST(NodeType.VARIABLE, "x"),
            createMockAST(NodeType.LITERAL, 0)
          ]),
          createMockAST(NodeType.ASSIGNMENT, undefined, [
            createMockAST(NodeType.VARIABLE, "x"),
            createMockAST(NodeType.LITERAL, 1)
          ]),
          createMockAST(NodeType.ASSIGNMENT, undefined, [
            createMockAST(NodeType.VARIABLE, "x"),
            createMockAST(NodeType.LITERAL, -1)
          ])
        ])
      ])
    ])
  ]);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(true);
  expect(result.output).toContain("if ((x > 0)) {");
  expect(result.output).toContain("} else {");
});

test("CodeGenerator - Generate while statements", () => {
  const symbolTable = createMockSymbolTable({ "i": { type: DataType.INTEGER, scope: "global" } });
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST(NodeType.PROGRAM, "Test", [
    createMockAST(NodeType.BLOCK, undefined, [
      createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
        createMockAST(NodeType.WHILE_STATEMENT, undefined, [
          createMockAST(NodeType.BINARY_OP, "<", [
            createMockAST(NodeType.VARIABLE, "i"),
            createMockAST(NodeType.LITERAL, 10)
          ]),
          createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
            createMockAST(NodeType.ASSIGNMENT, undefined, [
              createMockAST(NodeType.VARIABLE, "i"),
              createMockAST(NodeType.BINARY_OP, "+", [
                createMockAST(NodeType.VARIABLE, "i"),
                createMockAST(NodeType.LITERAL, 1)
              ])
            ])
          ])
        ])
      ])
    ])
  ]);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(true);
  expect(result.output).toContain("while ((i < 10)) {");
  expect(result.output).toContain("i = (i + 1);");
});

test("CodeGenerator - Generate for statements", () => {
  const symbolTable = createMockSymbolTable({ "i": { type: DataType.INTEGER, scope: "global" } });
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST(NodeType.PROGRAM, "Test", [
    createMockAST(NodeType.BLOCK, undefined, [
      createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
        createMockAST(NodeType.FOR_STATEMENT, undefined, [
          createMockAST(NodeType.VARIABLE, "i"),
          createMockAST(NodeType.LITERAL, 1),
          createMockAST(NodeType.LITERAL, 10),
          createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
            createMockAST(NodeType.WRITE_STATEMENT, undefined, [
              createMockAST(NodeType.VARIABLE, "i")
            ])
          ])
        ])
      ])
    ])
  ]);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(true);
  expect(result.output).toContain("for (let i = 1; i <= 10; i++) {");
  expect(result.output).toContain("ecrire(i);");
});

test("CodeGenerator - Generate repeat statements", () => {
  const symbolTable = createMockSymbolTable({ "x": { type: DataType.INTEGER, scope: "global" } });
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST(NodeType.PROGRAM, "Test", [
    createMockAST(NodeType.BLOCK, undefined, [
      createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
        createMockAST(NodeType.REPEAT_STATEMENT, undefined, [
          createMockAST(NodeType.ASSIGNMENT, undefined, [
            createMockAST(NodeType.VARIABLE, "x"),
            createMockAST(NodeType.BINARY_OP, "+", [
              createMockAST(NodeType.VARIABLE, "x"),
              createMockAST(NodeType.LITERAL, 1)
            ])
          ]),
          createMockAST(NodeType.BINARY_OP, ">=", [
            createMockAST(NodeType.VARIABLE, "x"),
            createMockAST(NodeType.LITERAL, 10)
          ])
        ])
      ])
    ])
  ]);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(true);
  expect(result.output).toContain("do {");
  expect(result.output).toContain("} while (!((x >= 10)));");
});

test("CodeGenerator - Generate read statements", () => {
  const symbolTable = createMockSymbolTable({ 
    "x": { type: DataType.INTEGER, scope: "global" },
    "y": { type: DataType.REAL, scope: "global" },
    "z": { type: DataType.STRING, scope: "global" }
  });
  
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST(NodeType.PROGRAM, "Test", [
    createMockAST(NodeType.BLOCK, undefined, [
      createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
        createMockAST(NodeType.READ_STATEMENT, undefined, [
          createMockAST(NodeType.VARIABLE, "x")
        ]),
        createMockAST(NodeType.READ_STATEMENT, undefined, [
          createMockAST(NodeType.VARIABLE, "y")
        ]),
        createMockAST(NodeType.READ_STATEMENT, undefined, [
          createMockAST(NodeType.VARIABLE, "z")
        ])
      ])
    ])
  ]);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(true);
  expect(result.output).toContain("x = parseInt(await lire(\"\"));");
  expect(result.output).toContain("y = parseInt(await lire(\"\"));");
  expect(result.output).toContain("z = await lire(\"\");");
});

test("CodeGenerator - Generate write statements", () => {
  const symbolTable = createMockSymbolTable({ "x": { type: DataType.INTEGER, scope: "global" } });
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST(NodeType.PROGRAM, "Test", [
    createMockAST(NodeType.BLOCK, undefined, [
      createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
        createMockAST(NodeType.WRITE_STATEMENT, undefined, [
          createMockAST(NodeType.LITERAL, "Bonjour")
        ]),
        createMockAST(NodeType.WRITE_STATEMENT, undefined, [
          createMockAST(NodeType.VARIABLE, "x")
        ]),
        createMockAST(NodeType.WRITE_STATEMENT, undefined, [
          createMockAST(NodeType.LITERAL, "Valeur: "),
          createMockAST(NodeType.VARIABLE, "x")
        ])
      ])
    ])
  ]);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(true);
  expect(result.output).toContain('ecrire("Bonjour");');
  expect(result.output).toContain("ecrire(x);");
  expect(result.output).toContain('ecrire("Valeur: ", x);');
});

test("CodeGenerator - Generate arithmetic expressions", () => {
  const symbolTable = createMockSymbolTable({ "x": { type: DataType.INTEGER, scope: "global" } });
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST(NodeType.PROGRAM, "Test", [
    createMockAST(NodeType.BLOCK, undefined, [
      createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
        createMockAST(NodeType.ASSIGNMENT, undefined, [
          createMockAST(NodeType.VARIABLE, "x"),
          createMockAST(NodeType.BINARY_OP, "+", [
            createMockAST(NodeType.BINARY_OP, "*", [
              createMockAST(NodeType.LITERAL, 2),
              createMockAST(NodeType.LITERAL, 3)
            ]),
            createMockAST(NodeType.BINARY_OP, "/", [
              createMockAST(NodeType.LITERAL, 10),
              createMockAST(NodeType.LITERAL, 2)
            ])
          ])
        ])
      ])
    ])
  ]);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(true);
  expect(result.output).toContain("x = ((2 * 3) + (10 / 2));");
});

test("CodeGenerator - Generate logical expressions", () => {
  const symbolTable = createMockSymbolTable({ "a": { type: DataType.BOOLEAN, scope: "global" } });
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST(NodeType.PROGRAM, "Test", [
    createMockAST(NodeType.BLOCK, undefined, [
      createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
        createMockAST(NodeType.ASSIGNMENT, undefined, [
          createMockAST(NodeType.VARIABLE, "a"),
          createMockAST(NodeType.BINARY_OP, "et", [
            createMockAST(NodeType.BINARY_OP, "ou", [
          createMockAST(NodeType.LITERAL, true),
              createMockAST(NodeType.LITERAL, false)
            ]),
            createMockAST(NodeType.UNARY_OP, "non", [
              createMockAST(NodeType.LITERAL, true)
            ])
          ])
        ])
      ])
    ])
  ]);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(true);
  expect(result.output).toContain('a = ((true || false) && !(true));');
});

test("CodeGenerator - Generate comparison expressions", () => {
  const symbolTable = createMockSymbolTable({ "x": { type: DataType.INTEGER, scope: "global" } });
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST(NodeType.PROGRAM, "Test", [
    createMockAST(NodeType.BLOCK, undefined, [
      createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
        createMockAST(NodeType.ASSIGNMENT, undefined, [
          createMockAST(NodeType.VARIABLE, "x"),
          createMockAST(NodeType.BINARY_OP, "=", [
            createMockAST(NodeType.LITERAL, 5),
            createMockAST(NodeType.LITERAL, 5)
          ])
        ]),
        createMockAST(NodeType.ASSIGNMENT, undefined, [
          createMockAST(NodeType.VARIABLE, "x"),
          createMockAST(NodeType.BINARY_OP, "<>", [
            createMockAST(NodeType.LITERAL, 5),
            createMockAST(NodeType.LITERAL, 10)
          ])
        ])
      ])
    ])
  ]);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(true);
  expect(result.output).toContain("x = (5 === 5);");
  expect(result.output).toContain("x = (5 !== 10);");
});

test("CodeGenerator - Generate literals", () => {
  const symbolTable = createMockSymbolTable();
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST(NodeType.PROGRAM, "Test", [
    createMockAST(NodeType.BLOCK, undefined, [
      createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
        createMockAST(NodeType.WRITE_STATEMENT, undefined, [
          createMockAST(NodeType.LITERAL, 42),
          createMockAST(NodeType.LITERAL, 3.14),
          createMockAST(NodeType.LITERAL, true),
          createMockAST(NodeType.LITERAL, false as any),
          createMockAST(NodeType.LITERAL, "Hello World")
        ])
      ])
    ])
  ]);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(true);
  expect(result.output).toContain('ecrire(42, 3.14, true, false, "Hello World");');
});

test("CodeGenerator - Handle unsupported node type", () => {
  const symbolTable = createMockSymbolTable();
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST("UNSUPPORTED_TYPE" as NodeType, undefined, []);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(false);
  expect(result.errors.length).toBeGreaterThan(0);
  expect(result.errors[0].code).toBe("UNSUPPORTED_NODE_TYPE");
});

test("CodeGenerator - Error handling during generation", () => {
  const symbolTable = createMockSymbolTable();
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  // Create an invalid AST that will cause an error
  const invalidAST = null as any;
  
  const result = codeGen.generate(invalidAST);
  
  expect(result.success).toBe(false);
  expect(result.errors.length).toBeGreaterThan(0);
});

test("CodeGenerator - Map operators correctly", () => {
  const symbolTable = createMockSymbolTable({ "x": { type: DataType.INTEGER, scope: "global" } });
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST(NodeType.PROGRAM, "Test", [
    createMockAST(NodeType.BLOCK, undefined, [
      createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
        createMockAST(NodeType.ASSIGNMENT, undefined, [
          createMockAST(NodeType.VARIABLE, "x"),
          createMockAST(NodeType.BINARY_OP, "<", [
            createMockAST(NodeType.LITERAL, 1),
            createMockAST(NodeType.LITERAL, 2)
          ])
        ])
      ])
    ])
  ]);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(true);
  expect(result.output).toContain("x = (1 < 2);");
});

test("CodeGenerator - Complex nested expressions", () => {
  const symbolTable = createMockSymbolTable({ 
    "x": { type: DataType.INTEGER, scope: "global" },
    "y": { type: DataType.INTEGER, scope: "global" },
    "z": { type: DataType.BOOLEAN, scope: "global" }
  });
  
  const codeGen = new CodeGenerator(symbolTable, { target: "javascript", optimizationLevel: 0, debugMode: false, pedagogicalMode: false });
  
  const programAST = createMockAST(NodeType.PROGRAM, "Test", [
    createMockAST(NodeType.BLOCK, undefined, [
      createMockAST(NodeType.COMPOUND_STATEMENT, undefined, [
        createMockAST(NodeType.ASSIGNMENT, undefined, [
          createMockAST(NodeType.VARIABLE, "z"),
          createMockAST(NodeType.BINARY_OP, "et", [
            createMockAST(NodeType.BINARY_OP, ">", [
              createMockAST(NodeType.VARIABLE, "x"),
              createMockAST(NodeType.LITERAL, 0)
            ]),
            createMockAST(NodeType.BINARY_OP, "<=", [
              createMockAST(NodeType.VARIABLE, "y"),
              createMockAST(NodeType.LITERAL, 100)
            ])
          ])
        ])
      ])
    ])
  ]);
  
  const result = codeGen.generate(programAST);
  
  expect(result.success).toBe(true);
  expect(result.output).toContain("z = ((x > 0) && (y <= 100));");
});