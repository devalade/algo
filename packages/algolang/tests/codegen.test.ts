import { describe, test, expect } from "bun:test";
import { CodeGenerator } from "../src/codegen/codegen";
import { NodeType } from "../src/types";
import {
	makeSymbolTable,
	lit, variable, binaryOp, unaryOp,
	assign, write, read, compound,
	ifStmt, whileStmt, forStmt, repeatStmt, returnStmt,
	varDecl, arrayDecl, arrayAccess, call,
	functionDecl, procedureDecl,
	program,
} from "./builders";

const defaultOptions = { target: "javascript" as const, optimizationLevel: 0 as const, debugMode: false, pedagogicalMode: false };
const gen = (ast: ReturnType<typeof program>, symbols = makeSymbolTable()) =>
	new CodeGenerator(symbols, defaultOptions).generate(ast);

// ── Basic structure ───────────────────────────────────────────────────────────

describe("CodeGenerator - structure", () => {
	test("emits readline boilerplate and async main", () => {
		const result = gen(program("Test"));
		expect(result.success).toBe(true);
		expect(result.output).toContain("// Code généré par AlgoLang");
		expect(result.output).toContain('import * as readline from "readline";');
		expect(result.output).toContain("async function main()");
	});

	test("emits variable declaration", () => {
		const result = gen(program("Test", varDecl("ENTIER", "x")));
		expect(result.success).toBe(true);
		expect(result.output).toContain("let x; // number");
	});

	test("emits multiple variables on one declaration", () => {
		const result = gen(program("Test", varDecl("ENTIER", "a", "b")));
		expect(result.output).toContain("let a, b; // number");
	});

	test("maps BOOLEEN to boolean and CHAINE to string", () => {
		const result = gen(program("Test", varDecl("BOOLEEN", "flag"), varDecl("CHAINE", "s")));
		expect(result.output).toContain("let flag; // boolean");
		expect(result.output).toContain("let s; // string");
	});
});

// ── Assignments ───────────────────────────────────────────────────────────────

describe("CodeGenerator - assignment", () => {
	test("scalar assignment", () => {
		const result = gen(program("Test", compound(assign(variable("x"), lit(42)))));
		expect(result.output).toContain("x = 42;");
	});

	test("array element assignment", () => {
		const result = gen(program("Test", compound(
			assign(arrayAccess("t", lit(0)), lit(99)),
		)));
		expect(result.output).toContain("t[0] = 99;");
	});
});

// ── Expressions ───────────────────────────────────────────────────────────────

describe("CodeGenerator - expressions", () => {
	test("arithmetic", () => {
		const expr = binaryOp("+", binaryOp("*", lit(2), lit(3)), binaryOp("/", lit(10), lit(2)));
		const result = gen(program("Test", compound(assign(variable("x"), expr))));
		expect(result.output).toContain("x = ((2 * 3) + (10 / 2));");
	});

	test("comparison: = maps to ===, <> maps to !==", () => {
		const result = gen(program("Test", compound(
			assign(variable("a"), binaryOp("=", lit(5), lit(5))),
			assign(variable("b"), binaryOp("<>", lit(5), lit(10))),
		)));
		expect(result.output).toContain("a = (5 === 5);");
		expect(result.output).toContain("b = (5 !== 10);");
	});

	test("logical operators", () => {
		const expr = binaryOp("et",
			binaryOp("ou", lit(true), lit(false)),
			unaryOp("non", lit(true)),
		);
		const result = gen(program("Test", compound(assign(variable("a"), expr))));
		expect(result.output).toContain("a = ((true || false) && !(true));");
	});

	test("modulo", () => {
		const result = gen(program("Test", compound(
			assign(variable("r"), binaryOp("%", variable("n"), lit(2))),
		)));
		expect(result.output).toContain("r = (n % 2);");
	});

	test("literals: number, boolean, string", () => {
		const result = gen(program("Test", compound(
			write(lit(42), lit(3.14), lit(true), lit(false as unknown as boolean), lit("Hi")),
		)));
		expect(result.output).toContain('ecrire(42, 3.14, true, false, "Hi");');
	});
});

// ── Control flow ──────────────────────────────────────────────────────────────

describe("CodeGenerator - control flow", () => {
	test("if", () => {
		const result = gen(program("Test", compound(
			ifStmt(binaryOp(">", variable("x"), lit(0)), assign(variable("x"), lit(1))),
		)));
		expect(result.output).toContain("if ((x > 0)) {");
		expect(result.output).toContain("x = 1;");
	});

	test("if-else", () => {
		const result = gen(program("Test", compound(
			ifStmt(
				binaryOp(">", variable("x"), lit(0)),
				assign(variable("x"), lit(1)),
				assign(variable("x"), lit(-1)),
			),
		)));
		expect(result.output).toContain("} else {");
	});

	test("while", () => {
		const result = gen(program("Test", compound(
			whileStmt(
				binaryOp("<", variable("i"), lit(10)),
				compound(assign(variable("i"), binaryOp("+", variable("i"), lit(1)))),
			),
		)));
		expect(result.output).toContain("while ((i < 10)) {");
		expect(result.output).toContain("i = (i + 1);");
	});

	test("for", () => {
		const result = gen(program("Test", compound(
			forStmt("i", lit(1), lit(10), compound(write(variable("i")))),
		)));
		expect(result.output).toContain("for (let i = 1; i <= 10; i++) {");
		expect(result.output).toContain("ecrire(i);");
	});

	test("repeat-until", () => {
		const result = gen(program("Test", compound(
			repeatStmt(
				assign(variable("x"), binaryOp("+", variable("x"), lit(1))),
				binaryOp(">=", variable("x"), lit(10)),
			),
		)));
		expect(result.output).toContain("do {");
		expect(result.output).toContain("} while (!((x >= 10)));");
	});
});

// ── I/O ───────────────────────────────────────────────────────────────────────

describe("CodeGenerator - I/O", () => {
	test("write single and multiple args", () => {
		const result = gen(program("Test", compound(
			write(lit("Bonjour")),
			write(lit("Val: "), variable("x")),
		)));
		expect(result.output).toContain('ecrire("Bonjour");');
		expect(result.output).toContain('ecrire("Val: ", x);');
	});

	test("read integer uses parseInt", () => {
		const result = gen(
			program("Test", compound(read(variable("x")))),
			makeSymbolTable({ x: { type: "ENTIER", scope: "global" } }),
		);
		expect(result.output).toContain('x = parseInt(await lire(""));');
	});

	test("read string does not use parseInt", () => {
		const result = gen(
			program("Test", compound(read(variable("s")))),
			makeSymbolTable({ s: { type: "CHAINE", scope: "global" } }),
		);
		expect(result.output).toContain('s = await lire("");');
	});

	test("read array element uses parseInt", () => {
		const result = gen(
			program("Test", compound(read(arrayAccess("t", lit(0))))),
			makeSymbolTable({ t: { type: "TABLEAU[5] DE ENTIER", scope: "global" } }),
		);
		expect(result.output).toContain('t[0] = parseInt(await lire(""));');
	});
});

// ── Arrays ────────────────────────────────────────────────────────────────────

describe("CodeGenerator - arrays", () => {
	test("ENTIER array declaration initialises with 0", () => {
		const result = gen(program("Test", arrayDecl("ENTIER", 5, "t")));
		expect(result.output).toContain("let t = new Array(5).fill(0);");
	});

	test("BOOLEEN array declaration initialises with false", () => {
		const result = gen(program("Test", arrayDecl("BOOLEEN", 3, "flags")));
		expect(result.output).toContain("let flags = new Array(3).fill(false);");
	});

	test("CHAINE array declaration initialises with empty string", () => {
		const result = gen(program("Test", arrayDecl("CHAINE", 4, "words")));
		expect(result.output).toContain('let words = new Array(4).fill("");');
	});

	test("array access in expression", () => {
		const result = gen(program("Test", compound(
			assign(variable("x"), arrayAccess("t", lit(2))),
		)));
		expect(result.output).toContain("x = t[2];");
	});
});

// ── Built-in functions ────────────────────────────────────────────────────────

describe("CodeGenerator - built-in functions", () => {
	test("abs → Math.abs", () => {
		const result = gen(program("Test", compound(assign(variable("x"), call("abs", variable("n"))))));
		expect(result.output).toContain("x = Math.abs(n);");
	});

	test("max → Math.max", () => {
		const result = gen(program("Test", compound(assign(variable("x"), call("max", lit(3), lit(7))))));
		expect(result.output).toContain("x = Math.max(3, 7);");
	});

	test("min → Math.min", () => {
		const result = gen(program("Test", compound(assign(variable("x"), call("min", lit(3), lit(7))))));
		expect(result.output).toContain("x = Math.min(3, 7);");
	});

	test("mod → %", () => {
		const result = gen(program("Test", compound(assign(variable("r"), call("mod", variable("a"), lit(2))))));
		expect(result.output).toContain("r = (a % 2);");
	});

	test("racine_carree → Math.sqrt", () => {
		const result = gen(program("Test", compound(assign(variable("r"), call("racine_carree", lit(9))))));
		expect(result.output).toContain("r = Math.sqrt(9);");
	});

	test("taille → .length", () => {
		const result = gen(program("Test", compound(assign(variable("n"), call("taille", variable("t"))))));
		expect(result.output).toContain("n = t.length;");
	});

	test("sous_chaine → .substring", () => {
		const result = gen(program("Test", compound(assign(variable("s"), call("sous_chaine", variable("str"), lit(1), lit(3))))));
		expect(result.output).toContain("s = str.substring(1, 1 + 3);");
	});

	test("concat → string +", () => {
		const result = gen(program("Test", compound(assign(variable("s"), call("concat", lit("hello"), lit(" world"))))));
		expect(result.output).toContain('s = "hello" + " world";');
	});

	test("entier_en_reel → identity", () => {
		const result = gen(program("Test", compound(assign(variable("r"), call("entier_en_reel", variable("n"))))));
		expect(result.output).toContain("r = n;");
	});

	test("reel_en_entier → Math.trunc", () => {
		const result = gen(program("Test", compound(assign(variable("n"), call("reel_en_entier", variable("r"))))));
		expect(result.output).toContain("n = Math.trunc(r);");
	});
});

// ── User-defined functions and procedures ─────────────────────────────────────

describe("CodeGenerator - functions and procedures", () => {
	test("function declaration emits async function before main", () => {
		const body = compound(returnStmt(binaryOp("*", variable("n"), variable("n"))));
		const result = gen(program("Test", functionDecl("carre", ["n"], body)));
		expect(result.output).toContain("async function carre(n) {");
		const fnIdx = result.output.indexOf("async function carre");
		const mainIdx = result.output.indexOf("async function main");
		expect(fnIdx).toBeLessThan(mainIdx);
	});

	test("procedure declaration emits async function before main", () => {
		const body = compound(write(variable("x")));
		const result = gen(program("Test", procedureDecl("afficher", ["x"], body)));
		expect(result.output).toContain("async function afficher(x) {");
	});

	test("return statement", () => {
		const body = compound(returnStmt(lit(42)));
		const result = gen(program("Test", functionDecl("f", [], body)));
		expect(result.output).toContain("return 42;");
	});

	test("user function call uses await and wraps in parens", () => {
		const result = gen(program("Test", compound(assign(variable("r"), call("carre", lit(5))))));
		expect(result.output).toContain("r = (await carre(5));");
	});

	test("user procedure call as statement strips parens and adds ;", () => {
		const result = gen(program("Test", compound(call("afficher", variable("x")))));
		expect(result.output).toContain("await afficher(x);");
	});
});

// ── Error cases ───────────────────────────────────────────────────────────────

describe("CodeGenerator - error handling", () => {
	test("unsupported node type records UNSUPPORTED_NODE_TYPE error", () => {
		const ast = { type: "UNKNOWN_NODE" as NodeType, children: [] };
		const result = new CodeGenerator(makeSymbolTable(), defaultOptions).generate(ast as any);
		expect(result.success).toBe(false);
		expect(result.errors[0].code).toBe("UNSUPPORTED_NODE_TYPE");
	});

	test("null AST records GENERATION_ERROR", () => {
		const result = new CodeGenerator(makeSymbolTable(), defaultOptions).generate(null as any);
		expect(result.success).toBe(false);
		expect(result.errors.length).toBeGreaterThan(0);
	});
});
