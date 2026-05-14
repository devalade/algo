/**
 * AST node and symbol table builder helpers for unit-testing CodeGenerator
 * directly, without going through the Parser.
 *
 * Each builder returns a minimal valid ASTNode (or SymbolTable) that satisfies
 * the structural contracts expected by the corresponding generate* method.
 */
import { NodeType } from "../src/types/index";
import type { ASTNode, SymbolInfo, SymbolTable } from "../src/types/index";

// ── Symbol table ─────────────────────────────────────────────────────────────

export function makeSymbolTable(
	entries: Record<string, Pick<SymbolInfo, "type" | "scope">> = {},
): SymbolTable {
	const symbols = new Map<string, SymbolInfo>();
	for (const [name, info] of Object.entries(entries)) {
		symbols.set(name, { name, type: info.type, scope: info.scope, line: 1, column: 1 });
	}
	return { symbols, children: [], scopeName: "global" };
}

// ── Primitive nodes ───────────────────────────────────────────────────────────

export const lit = (value: string | number | boolean): ASTNode => ({
	type: NodeType.LITERAL,
	value,
	children: [],
});

export const variable = (name: string): ASTNode => ({
	type: NodeType.VARIABLE,
	value: name,
	children: [],
});

export const binaryOp = (op: string, left: ASTNode, right: ASTNode): ASTNode => ({
	type: NodeType.BINARY_OP,
	value: op,
	children: [left, right],
});

export const unaryOp = (op: string, operand: ASTNode): ASTNode => ({
	type: NodeType.UNARY_OP,
	value: op,
	children: [operand],
});

// ── Statements ────────────────────────────────────────────────────────────────

export const assign = (target: ASTNode, expr: ASTNode): ASTNode => ({
	type: NodeType.ASSIGNMENT,
	children: [target, expr],
});

export const write = (...exprs: ASTNode[]): ASTNode => ({
	type: NodeType.WRITE_STATEMENT,
	children: exprs,
});

export const read = (target: ASTNode): ASTNode => ({
	type: NodeType.READ_STATEMENT,
	children: [target],
});

export const compound = (...stmts: ASTNode[]): ASTNode => ({
	type: NodeType.COMPOUND_STATEMENT,
	children: stmts,
});

export const ifStmt = (cond: ASTNode, then: ASTNode, els?: ASTNode): ASTNode => ({
	type: NodeType.IF_STATEMENT,
	children: els ? [cond, then, els] : [cond, then],
});

export const whileStmt = (cond: ASTNode, body: ASTNode): ASTNode => ({
	type: NodeType.WHILE_STATEMENT,
	children: [cond, body],
});

export const forStmt = (
	varName: string,
	start: ASTNode,
	end: ASTNode,
	body: ASTNode,
): ASTNode => ({
	type: NodeType.FOR_STATEMENT,
	children: [variable(varName), start, end, body],
});

export const repeatStmt = (body: ASTNode, until: ASTNode): ASTNode => ({
	type: NodeType.REPEAT_STATEMENT,
	children: [body, until],
});

export const returnStmt = (expr?: ASTNode): ASTNode => ({
	type: NodeType.RETURN_STATEMENT,
	children: expr ? [expr] : [],
});

// ── Declarations ──────────────────────────────────────────────────────────────

export const varDecl = (algoType: string, ...names: string[]): ASTNode => ({
	type: NodeType.VAR_DECLARATION,
	value: algoType,
	children: names.map(variable),
});

/**
 * Array declaration: `t: TABLEAU[size] DE elemType`
 * children[0] = LITERAL(size), children[1+] = VARIABLE(name)
 */
export const arrayDecl = (elemType: string, size: number, ...names: string[]): ASTNode => ({
	type: NodeType.ARRAY_DECLARATION,
	value: elemType,
	children: [lit(size), ...names.map(variable)],
});

export const arrayAccess = (name: string, index: ASTNode): ASTNode => ({
	type: NodeType.ARRAY_ACCESS,
	value: name,
	children: [index],
});

// ── Function / procedure calls ────────────────────────────────────────────────

export const call = (name: string, ...args: ASTNode[]): ASTNode => ({
	type: NodeType.FUNCTION_CALL,
	value: name,
	children: args,
});

// ── Function / procedure declarations ────────────────────────────────────────

const paramList = (...names: string[]): ASTNode => ({
	type: NodeType.PARAMETER_LIST,
	children: names.map((n) => ({ type: NodeType.PARAMETER, value: n, children: [] })),
});

/**
 * FUNCTION_DECLARATION: children = [paramList, returnTypePlaceholder, body]
 * The codegen skips children[1] (return type), so a dummy LITERAL works.
 */
export const functionDecl = (
	name: string,
	params: string[],
	body: ASTNode,
): ASTNode => ({
	type: NodeType.FUNCTION_DECLARATION,
	value: name,
	children: [paramList(...params), lit(""), body],
});

export const procedureDecl = (name: string, params: string[], body: ASTNode): ASTNode => ({
	type: NodeType.PROCEDURE_DECLARATION,
	value: name,
	children: [paramList(...params), body],
});

// ── Program wrapper ───────────────────────────────────────────────────────────

export const program = (name: string, ...children: ASTNode[]): ASTNode => ({
	type: NodeType.PROGRAM,
	value: name,
	children: [{ type: NodeType.BLOCK, children }],
});
