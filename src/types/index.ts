// Types de base pour AlgoLang
export enum TokenType {
	// Mots-clés en français
	PROGRAM = "PROGRAMME",
	BEGIN = "DEBUT",
	END = "FIN",
	VAR = "VAR",
	INTEGER = "ENTIER",
	REAL = "REEL",
	BOOLEAN = "BOOLEEN",
	STRING = "CHAINE",
	IF = "SI",
	THEN = "ALORS",
	ELSE = "SINON",
	WHILE = "TANTQUE",
	DO = "FAIRE",
	FOR = "POUR",
	ALLANT = "ALLANT",
	DE = "DE",
	TO = "A",
	REPEAT = "REPETER",
	UNTIL = "JUSQUA",
	READ = "LIRE",
	WRITE = "ECRIRE",
	TRUE = "VRAI",
	FALSE = "FAUX",
	AND = "ET",
	OR = "OU",
	NOT = "NON",
	ENDFOR = "FINPOUR",
	ENDIF = "FINIF",
	ENDWHILE = "FINTANTQUE",

	// Opérateurs
	PLUS = "PLUS",
	MINUS = "MINUS",
	MULTIPLY = "MULTIPLY",
	DIVIDE = "DIVIDE",
	ASSIGN = "ASSIGN",
	EQUAL = "EQUAL",
	NOT_EQUAL = "NOT_EQUAL",
	LESS_THAN = "LESS_THAN",
	LESS_EQUAL = "LESS_EQUAL",
	GREATER_THAN = "GREATER_THAN",
	GREATER_EQUAL = "GREATER_EQUAL",

	// Délimiteurs
	SEMICOLON = "SEMICOLON",
	COLON = "COLON",
	COMMA = "COMMA",
	DOT = "DOT",
	LEFT_PAREN = "LEFT_PAREN",
	RIGHT_PAREN = "RIGHT_PAREN",

	// Littéraux et identificateurs
	NUMBER = "NUMBER",
	IDENTIFIER = "IDENTIFIER",
	STRING_LITERAL = "STRING_LITERAL",

	// Spécial
	EOF = "EOF",
	NEWLINE = "NEWLINE",
	COMMENT = "COMMENT",
}

export interface Token {
	type: TokenType;
	value: string;
	line: number;
	column: number;
	position: number;
}

export enum NodeType {
	// Programme
	PROGRAM = "PROGRAM",

	// Déclarations
	VAR_DECLARATION = "VAR_DECLARATION",
	TYPE_SPECIFIER = "TYPE_SPECIFIER",

	// Instructions
	ASSIGNMENT = "ASSIGNMENT",
	IF_STATEMENT = "IF_STATEMENT",
	WHILE_STATEMENT = "WHILE_STATEMENT",
	FOR_STATEMENT = "FOR_STATEMENT",
	REPEAT_STATEMENT = "REPEAT_STATEMENT",
	READ_STATEMENT = "READ_STATEMENT",
	WRITE_STATEMENT = "WRITE_STATEMENT",
	COMPOUND_STATEMENT = "COMPOUND_STATEMENT",

	// Expressions
	BINARY_OP = "BINARY_OP",
	UNARY_OP = "UNARY_OP",
	LITERAL = "LITERAL",
	VARIABLE = "VARIABLE",

	// Utilitaires
	BLOCK = "BLOCK",
	PARAMETER_LIST = "PARAMETER_LIST",
}

export interface ASTNode {
	type: NodeType;
	value?: string | number | boolean;
	children?: ASTNode[];
	token?: Token;
	symbolInfo?: SymbolInfo;
}

export interface SymbolInfo {
	name: string;
	type: string;
	scope: string;
	isConstant?: boolean;
	initialValue?: any;
	line?: number;
	column?: number;
}

export interface SymbolTable {
	symbols: Map<string, SymbolInfo>;
	parent?: SymbolTable;
	children: SymbolTable[];
	scopeName: string;
}

export enum DataType {
	INTEGER = "ENTIER",
	REAL = "REEL",
	BOOLEAN = "BOOLEEN",
	STRING = "CHAINE",
	VOID = "VIDE",
}

export interface VariableInfo {
	name: string;
	type: DataType;
	value?: any;
	isInitialized: boolean;
}

export interface CompilationContext {
	sourceCode: string;
	filePath: string;
	symbolTable: SymbolTable;
	currentScope: SymbolTable;
	errors: CompilationError[];
	warnings: CompilationWarning[];
}

export interface CompilationError {
	type: "ERROR";
	message: string;
	line: number;
	column: number;
	position: number;
	code: string;
	explanation?: string;
	suggestion?: string;
}

export interface CompilationWarning {
	type: "WARNING";
	message: string;
	line: number;
	column: number;
	position: number;
	code: string;
}

export interface CompilerOptions {
	target: "javascript";
	optimizationLevel: 0 | 1 | 2 | 3;
	debugMode: boolean;
	pedagogicalMode: boolean;
	outputFilePath?: string;
}

export interface CompiledOutput {
	success: boolean;
	output: string;
	errors: CompilationError[];
	warnings: CompilationWarning[];
	executionTime?: number;
	memoryUsage?: number;
	symbolTable?: SymbolTable;
	ast?: ASTNode;
}
