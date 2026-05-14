import { Lexer } from "@/lexer/lexer";
import { Parser } from "@/parser/parser";
import { CodeGenerator } from "@/codegen/codegen";
import type {
	CompilationContext,
	CompilerOptions,
	CompiledOutput,
	CompilationError,
} from "@/types";

export class AlgoLangCompiler {
	private options: CompilerOptions;

	constructor(options: Partial<CompilerOptions> = {}) {
		this.options = {
			target: "javascript",
			optimizationLevel: 1,
			debugMode: false,
			pedagogicalMode: true,
			...options,
		};
	}

	public compile(
		sourceCode: string,
		filePath: string = "<input>",
	): CompiledOutput {
		const startTime = performance.now();

		try {
			// Créer le contexte de compilation
			const context: CompilationContext = {
				sourceCode,
				filePath,
				symbolTable: {
					symbols: new Map(),
					children: [],
					scopeName: "global",
				},
				currentScope: {
					symbols: new Map(),
					children: [],
					scopeName: "global",
				},
				errors: [],
				warnings: [],
			};

			// Phase 1: Analyse lexicale
			const lexer = new Lexer(sourceCode);
			let tokens: any[];

			try {
				tokens = lexer.tokenize();

				if (this.options.debugMode) {
					console.log("Tokens générés:", tokens.length);
				}
			} catch (error) {
				return this.createErrorOutput(
					error instanceof Error
						? error.message
						: "Erreur lors de l'analyse lexicale",
					context,
					Date.now() - startTime,
				);
			}

			// Phase 2: Analyse syntaxique
			const parser = new Parser(tokens);
			let parseResult: any;

			try {
				parseResult = parser.parse();
				context.symbolTable = parseResult.symbolTable;
				context.errors.push(...parseResult.errors);

				if (this.options.debugMode) {
					console.log("AST généré avec", parseResult.errors.length, "erreurs");
				}
			} catch (error) {
				return this.createErrorOutput(
					error instanceof Error
						? error.message
						: "Erreur lors de l'analyse syntaxique",
					context,
					Date.now() - startTime,
				);
			}

			// Phase 3: Génération de code
			const codeGenerator = new CodeGenerator(
				context.symbolTable,
				this.options,
			);
			let compiledOutput: CompiledOutput;

			try {
				compiledOutput = codeGenerator.generate(parseResult.ast);
				context.errors.push(...compiledOutput.errors);
				context.warnings.push(...compiledOutput.warnings);

				if (this.options.debugMode) {
					console.log("Code généré avec succès");
				}
			} catch (error) {
				return this.createErrorOutput(
					error instanceof Error
						? error.message
						: "Erreur lors de la génération de code",
					context,
					Date.now() - startTime,
				);
			}

			// Phase 4: Post-traitement et optimisation
			const finalOutput = this.postProcess(compiledOutput, context);

			return {
				...finalOutput,
				output: finalOutput.output,
				errors: context.errors,
				warnings: context.warnings,
				symbolTable: context.symbolTable,
				ast: parseResult.ast,
				success: context.errors.length === 0,
				executionTime: performance.now() - startTime,
			};
		} catch (error) {
			return this.createErrorOutput(
				error instanceof Error
					? error.message
					: "Erreur inconnue lors de la compilation",
				{
					sourceCode,
					filePath,
					symbolTable: {
						symbols: new Map(),
						children: [],
						scopeName: "global",
					},
					currentScope: {
						symbols: new Map(),
						children: [],
						scopeName: "global",
					},
					errors: [],
					warnings: [],
				},
				Date.now() - startTime,
			);
		}
	}

	private postProcess(
		output: CompiledOutput,
		context: CompilationContext,
	): CompiledOutput {
		let processedOutput = output.output;

		// Optimisations basées sur le niveau
		if (this.options.optimizationLevel >= 1) {
			processedOutput = this.applyBasicOptimizations(processedOutput);
		}

		if (this.options.optimizationLevel >= 2) {
			processedOutput = this.applyAdvancedOptimizations(processedOutput);
		}

		if (this.options.optimizationLevel >= 3) {
			processedOutput = this.applyAggressiveOptimizations(processedOutput);
		}

		// Mode pédagogique : ajouter des commentaires explicatifs
		if (this.options.pedagogicalMode) {
			processedOutput = this.addPedagogicalComments(processedOutput, context);
		}

		return {
			...output,
			output: processedOutput,
		};
	}

	private applyBasicOptimizations(code: string): string {
		// Supprimer les lignes vides multiples
		return code.replace(/\n\s*\n\s*\n/g, "\n\n");
	}

	private applyAdvancedOptimizations(code: string): string {
		// Optimisations plus avancées pourraient être ajoutées ici
		return code;
	}

	private applyAggressiveOptimizations(code: string): string {
		// Optimisations agressives pourraient être ajoutées ici
		return code;
	}

	private addPedagogicalComments(
		code: string,
		context: CompilationContext,
	): string {
		const lines = code.split("\n");
		const commentedLines: string[] = [];

		commentedLines.push("// ===============================================");
		commentedLines.push("// Code généré par AlgoLang - Compilateur Éducatif");
		commentedLines.push("// Fichier source: " + context.filePath);
		commentedLines.push(
			"// Variables déclarées: " + context.symbolTable.symbols.size,
		);
		commentedLines.push("// Erreurs de compilation: " + context.errors.length);
		commentedLines.push("// Avertissements: " + context.warnings.length);
		commentedLines.push("// ===============================================");
		commentedLines.push("");

		// Ajouter des commentaires pédagogiques pour les sections importantes
		for (const line of lines) {
			commentedLines.push(line);

			// Ajouter des commentaires explicatifs pour les concepts clés
			if (line.includes("function main()")) {
				commentedLines.push("// Point d'entrée principal");
			} else if (line.includes("let ")) {
				commentedLines.push("// Déclaration de variable");
			} else if (line.includes("if (")) {
				commentedLines.push(
					"// Structure conditionnelle : exécute le code si la condition est vraie",
				);
			} else if (line.includes("while (")) {
				commentedLines.push(
					"// Boucle conditionnelle : répète tant que la condition est vraie",
				);
			} else if (line.includes("for (")) {
				commentedLines.push(
					"// Boucle itérative : répète pour un nombre défini d'itérations",
				);
			}
		}

		return commentedLines.join("\n");
	}

	private createErrorOutput(
		message: string,
		context: CompilationContext,
		executionTime: number,
	): CompiledOutput {
		return {
			success: false,
			output: "",
			errors: [
				...context.errors,
				{
					type: "ERROR",
					message,
					line: 0,
					column: 0,
					position: 0,
					code: "COMPILATION_ERROR",
				},
			],
			warnings: context.warnings,
			executionTime,
		};
	}

	// Méthodes utilitaires pour l'analyse de code
	public validateSyntax(sourceCode: string): {
		valid: boolean;
		errors: CompilationError[];
	} {
		try {
			const lexer = new Lexer(sourceCode);
			const tokens = lexer.tokenize();

			const parser = new Parser(tokens);
			const result = parser.parse();

			return {
				valid: result.errors.length === 0,
				errors: result.errors,
			};
		} catch (error) {
			return {
				valid: false,
				errors: [
					{
						type: "ERROR",
						message:
							error instanceof Error
								? error.message
								: "Erreur de syntaxe inconnue",
						line: 0,
						column: 0,
						position: 0,
						code: "SYNTAX_ERROR",
					},
				],
			};
		}
	}

	public getSymbolTable(sourceCode: string): any {
		try {
			const lexer = new Lexer(sourceCode);
			const tokens = lexer.tokenize();

			const parser = new Parser(tokens);
			const result = parser.parse();

			return result.symbolTable;
		} catch (error) {
			return {
				symbols: new Map(),
				children: [],
				scopeName: "global",
			};
		}
	}

	public formatError(error: CompilationError): string {
		let formatted = `❌ Erreur [${error.code}]: ${error.message}`;

		if (error.line > 0) {
			formatted += ` (ligne ${error.line}`;
			if (error.column > 0) {
				formatted += `, colonne ${error.column}`;
			}
			formatted += ")";
		}

		if (this.options.pedagogicalMode && error.explanation) {
			formatted += `\n\n💡 Explication: ${error.explanation}`;
		}

		if (this.options.pedagogicalMode && error.suggestion) {
			formatted += `\n\n🔧 Suggestion: ${error.suggestion}`;
		}

		return formatted;
	}
}
