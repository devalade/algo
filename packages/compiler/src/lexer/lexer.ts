import type { Token } from "@/types";
import { TokenType } from "@/types";

export class Lexer {
	private source: string;
	private position: number = 0;
	private line: number = 1;
	private column: number = 1;
	private keywords: Map<string, TokenType>;

	constructor(source: string) {
		this.source = source;
		this.keywords = new Map([
			["programme", TokenType.PROGRAM],
			["debut", TokenType.BEGIN],
			["fin", TokenType.END],
			["var", TokenType.VAR],
			["entier", TokenType.INTEGER],
			["reel", TokenType.REAL],
			["booleen", TokenType.BOOLEAN],
			["chaine", TokenType.STRING],
			["si", TokenType.IF],
			["alors", TokenType.THEN],
			["sinon", TokenType.ELSE],
			["finsi", TokenType.ENDIF],
			["tantque", TokenType.WHILE],
			["faire", TokenType.DO],
			["pour", TokenType.FOR],
			["allant", TokenType.ALLANT],
			["de", TokenType.DE],
			["à", TokenType.TO],
			["repeter", TokenType.REPEAT],
			["jusqu'à", TokenType.UNTIL],
			["lire", TokenType.READ],
			["ecrire", TokenType.WRITE],
			["vrai", TokenType.TRUE],
			["faux", TokenType.FALSE],
			["et", TokenType.AND],
			["ou", TokenType.OR],
			["non", TokenType.NOT],
			["finpour", TokenType.ENDFOR],
			["fintantque", TokenType.ENDWHILE],
		]);
	}

	public tokenize(): Token[] {
		const tokens: Token[] = [];

		while (!this.isAtEnd()) {
			const token = this.scanToken();
			if (token.type !== TokenType.COMMENT) {
				tokens.push(token);
			}
		}

		// Ajouter le token EOF
		tokens.push({
			type: TokenType.EOF,
			value: "",
			line: this.line,
			column: this.column,
			position: this.position,
		});

		return tokens;
	}

	private scanToken(): Token {
		this.skipWhitespace();

		if (this.isAtEnd()) {
			return this.createToken(TokenType.EOF, "");
		}

		const char = this.currentChar();

		// Vérifier les commentaires
		if (char === "/" && this.peek() === "/") {
			return this.scanLineComment();
		}

		if (char === "/" && this.peek() === "*") {
			return this.scanBlockComment();
		}

		// Vérifier les chaînes de caractères
		if (char === '"') {
			return this.scanString();
		}

		// Vérifier les nombres
		if (this.isDigit(char)) {
			return this.scanNumber();
		}

		// Vérifier les identificateurs et mots-clés
		if (this.isAlpha(char)) {
			return this.scanIdentifier();
		}

		// Vérifier les opérateurs multi-caractères
		if (char === ":" && this.peek() === "=") {
			const token = this.createToken(TokenType.ASSIGN, ":=");
			this.advance();
			this.advance();
			return token;
		}

		if (char === "<" && this.peek() === "=") {
			const token = this.createToken(TokenType.LESS_EQUAL, "<=");
			this.advance();
			this.advance();
			return token;
		}

		if (char === ">" && this.peek() === "=") {
			const token = this.createToken(TokenType.GREATER_EQUAL, ">=");
			this.advance();
			this.advance();
			return token;
		}

		if (char === "<" && this.peek() === ">") {
			const token = this.createToken(TokenType.NOT_EQUAL, "<>");
			this.advance();
			this.advance();
			return token;
		}

		// Vérifier les opérateurs et délimiteurs simples
		switch (char) {
			case "+":
				return this.createToken(TokenType.PLUS, this.advance());
			case "-":
				return this.createToken(TokenType.MINUS, this.advance());
			case "*":
				return this.createToken(TokenType.MULTIPLY, this.advance());
			case "/":
				return this.createToken(TokenType.DIVIDE, this.advance());
			case "=":
				return this.createToken(TokenType.EQUAL, this.advance());
			case "<":
				return this.createToken(TokenType.LESS_THAN, this.advance());
			case ">":
				return this.createToken(TokenType.GREATER_THAN, this.advance());
			case ";":
				return this.createToken(TokenType.SEMICOLON, this.advance());
			case ":":
				return this.createToken(TokenType.COLON, this.advance());
			case ",":
				return this.createToken(TokenType.COMMA, this.advance());
			case ".":
				return this.createToken(TokenType.DOT, this.advance());
			case "(":
				return this.createToken(TokenType.LEFT_PAREN, this.advance());
			case ")":
				return this.createToken(TokenType.RIGHT_PAREN, this.advance());
			default:
				throw new Error(
					`Caractère non reconnu '${char}' à la ligne ${this.line}, colonne ${this.column}`,
				);
		}
	}

	private scanIdentifier(): Token {
		const start = this.position;
		const startColumn = this.column;

		while (!this.isAtEnd() && this.isAlphaNumeric(this.currentChar())) {
			this.advance();
		}

		const value = this.source.substring(start, this.position);
		const type = this.keywords.get(value.toLowerCase()) || TokenType.IDENTIFIER;

		return {
			type,
			value,
			line: this.line,
			column: startColumn,
			position: start,
		};
	}

	private scanNumber(): Token {
		const start = this.position;
		const startColumn = this.column;
		let hasDecimal = false;

		while (
			!this.isAtEnd() &&
			(this.isDigit(this.currentChar()) || this.currentChar() === ".")
		) {
			if (this.currentChar() === ".") {
				if (hasDecimal) {
					throw new Error(
						`Nombre invalide: trop de points décimaux à la ligne ${this.line}, colonne ${this.column}`,
					);
				}
				hasDecimal = true;
			}
			this.advance();
		}

		const value = this.source.substring(start, this.position);

		return {
			type: TokenType.NUMBER,
			value,
			line: this.line,
			column: startColumn,
			position: start,
		};
	}

	private scanString(): Token {
		const start = this.position;
		const startColumn = this.column;

		this.advance(); // Sauter le guillemet ouvrant

		let value = "";
		while (!this.isAtEnd() && this.currentChar() !== '"') {
			if (this.currentChar() === "\\") {
				this.advance();
				if (this.isAtEnd()) {
					throw new Error(
						`Chaîne de caractères non terminée à la ligne ${this.line}, colonne ${this.column}`,
					);
				}

				const escaped = this.currentChar();
				switch (escaped) {
					case "n":
						value += "\n";
						break;
					case "t":
						value += "\t";
						break;
					case "r":
						value += "\r";
						break;
					case "\\":
						value += "\\";
						break;
					case '"':
						value += '"';
						break;
					default:
						value += escaped;
						break;
				}
				this.advance();
			} else {
				value += this.currentChar();
				this.advance();
			}
		}

		if (this.isAtEnd()) {
			throw new Error(
				`Chaîne de caractères non terminée à la ligne ${this.line}, colonne ${this.column}`,
			);
		}

		this.advance(); // Sauter le guillemet fermant

		return {
			type: TokenType.STRING_LITERAL,
			value,
			line: this.line,
			column: startColumn,
			position: start,
		};
	}

	private scanLineComment(): Token {
		const start = this.position;
		const startColumn = this.column;

		while (!this.isAtEnd() && this.currentChar() !== "\n") {
			this.advance();
		}

		const value = this.source.substring(start, this.position);

		return {
			type: TokenType.COMMENT,
			value,
			line: this.line,
			column: startColumn,
			position: start,
		};
	}

	private scanBlockComment(): Token {
		const start = this.position;
		const startColumn = this.column;
		this.advance(); // Sauter '*'

		while (
			!this.isAtEnd() &&
			!(this.currentChar() === "*" && this.peek() === "/")
		) {
			if (this.currentChar() === "\n") {
				this.line++;
				this.column = 1;
			} else {
				this.column++;
			}
			this.advance();
		}

		if (this.isAtEnd()) {
			throw new Error(
				`Commentaire bloc non terminé commençant à la ligne ${this.line}, colonne ${this.column}`,
			);
		}

		this.advance(); // Sauter '*'
		this.advance(); // Sauter '/'

		const value = this.source.substring(start, this.position);

		return {
			type: TokenType.COMMENT,
			value,
			line: this.line,
			column: startColumn,
			position: start,
		};
	}

	private skipWhitespace(): void {
		while (!this.isAtEnd() && this.isWhitespace(this.currentChar())) {
			if (this.currentChar() === "\n") {
				this.line++;
				this.column = 1;
			} else {
				this.column++;
			}
			this.advance();
		}
	}

	private createToken(type: TokenType, value: string): Token {
		return {
			type,
			value,
			line: this.line,
			column: this.column,
			position: this.position,
		};
	}

	private advance(): string {
		const char = this.source[this.position];
		this.position++;
		return char !== undefined ? char : "\0";
	}

	private currentChar(): string {
		const char = this.source[this.position];
		return char !== undefined ? char : "\0";
	}

	private peek(): string {
		if (this.position + 1 >= this.source.length) {
			return "\0";
		}
		const char = this.source[this.position + 1];
		return char !== undefined ? char : "\0";
	}

	private isAtEnd(): boolean {
		return this.position >= this.source.length;
	}

	private isDigit(char: string): boolean {
		return char >= "0" && char <= "9";
	}

	private isAlpha(char: string): boolean {
		return (
			(char >= "a" && char <= "z") ||
			(char >= "A" && char <= "Z") ||
			(char >= "\u00C0" && char <= "\u00FF") || // Expanded Latin-1 for accented characters
			char === "_" ||
			char === "'"
		);
	}

	private isAlphaNumeric(char: string): boolean {
		return this.isAlpha(char) || this.isDigit(char);
	}

	private isWhitespace(char: string): boolean {
		return char === " " || char === "\t" || char === "\n" || char === "\r";
	}
}
