#!/usr/bin/env bun
import { Command } from "commander";
import chalk from "chalk";
import { AlgoLangCompiler } from "@/compiler";
import type { CompilerOptions } from "@/types";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const program = new Command();

program
	.name("algolang")
	.description(
		"Compilateur AlgoLang - Langage de programmation éducatif pour l'algorithmique",
	)
	.version("1.0.0");

// Commande compile
program
	.command("compile")
	.description("Compiler un fichier AlgoLang")
	.argument("<file>", "Fichier source AlgoLang (.algo)")
	.option("-o, --output <file>", "Fichier de sortie", "output.js")
	.option("-O, --optimize <level>", "Niveau d'optimisation (0-3)", "1")
	.option("-d, --debug", "Mode debug")
	.option("--no-pedagogical", "Désactiver le mode pédagogique")
	.option(
		"--validate-only",
		"Valider uniquement la syntaxe sans générer de code",
	)
	.action(async (file: string, options) => {
		try {
			console.log(chalk.blue("🔧 AlgoLang Compilateur v1.0.0"));
			console.log(chalk.gray(`Compilation de: ${file}`));

			// Lire le fichier source
			const sourceCode = readFileSync(file, "utf-8");

			// Configurer les options de compilation
			const compilerOptions: CompilerOptions = {
				target: "javascript",
				optimizationLevel: parseInt(options.optimize) as 0 | 1 | 2 | 3,
				debugMode: options.debug || false,
				pedagogicalMode: options.pedagogical !== false,
				outputFilePath: options.output,
			};

			// Créer le compilateur
			const compiler = new AlgoLangCompiler(compilerOptions);

			if (options.validateOnly) {
				// Validation uniquement
				console.log(chalk.yellow("📋 Validation de la syntaxe..."));
				const validation = compiler.validateSyntax(sourceCode);

				if (validation.valid) {
					console.log(chalk.green("✅ Syntaxe valide!"));
					process.exit(0);
				} else {
					console.log(chalk.red("❌ Erreurs de syntaxe trouvées:"));
					validation.errors.forEach((error) => {
						console.log(chalk.red(`  • ${compiler.formatError(error)}`));
					});
					process.exit(1);
				}
			}

			// Compiler le code
			console.log(chalk.yellow("⚙️  Compilation en cours..."));
			const result = compiler.compile(sourceCode, file);

			// Afficher les résultats
			if (result.success) {
				console.log(chalk.green("✅ Compilation réussie!"));

				if (result.executionTime) {
					console.log(
						chalk.gray(`⏱️  Temps d'exécution: ${result.executionTime}ms`),
					);
				}

				// Écrire le fichier de sortie
				writeFileSync(options.output, result.output);
				console.log(chalk.cyan(`📁 Fichier généré: ${options.output}`));

				// Afficher les statistiques
				if (result.symbolTable) {
					console.log(
						chalk.gray(`📊 Variables: ${result.symbolTable.symbols.size}`),
					);
				}

				if (result.warnings.length > 0) {
					console.log(chalk.yellow("⚠️  Avertissements:"));
					result.warnings.forEach((warning) => {
						console.log(chalk.yellow(`  • ${warning.message}`));
					});
				}
			} else {
				console.log(chalk.red("❌ Échec de la compilation!"));

				if (result.errors.length > 0) {
					console.log(chalk.red("🔍 Erreurs trouvées:"));
					result.errors.forEach((error) => {
						console.log(chalk.red(`  • ${compiler.formatError(error)}`));
					});
				}

				process.exit(1);
			}
		} catch (error) {
			console.log(chalk.red("💥 Erreur fatale:"));
			console.log(
				chalk.red(error instanceof Error ? error.message : "Erreur inconnue"),
			);
			process.exit(1);
		}
	});

// Commande run
program
	.command("run")
	.description("Compiler et exécuter un fichier AlgoLang")
	.argument("<file>", "Fichier source AlgoLang (.algo)")
	.option("-O, --optimize <level>", "Niveau d'optimisation (0-3)", "1")
	.option("-d, --debug", "Mode debug")
	.option("--no-pedagogical", "Désactiver le mode pédagogique")
	.action(async (file: string, options) => {
		try {
			console.log(chalk.blue("🚀 AlgoLang Runner v1.0.0"));
			console.log(chalk.gray(`Exécution de: ${file}`));

			// Lire le fichier source
			const sourceCode = readFileSync(file, "utf-8");

			// Configurer les options de compilation
			const compilerOptions: CompilerOptions = {
				target: "javascript",
				optimizationLevel: parseInt(options.optimize) as 0 | 1 | 2 | 3,
				debugMode: options.debug || false,
				pedagogicalMode: options.pedagogical !== false,
			};

			// Créer le compilateur
			const compiler = new AlgoLangCompiler(compilerOptions);

			// Compiler le code
			console.log(chalk.yellow("⚙️  Compilation..."));
			const result = compiler.compile(sourceCode, file);

			if (!result.success) {
				console.log(chalk.red("❌ Échec de la compilation!"));
				result.errors.forEach((error) => {
					console.log(chalk.red(`  • ${compiler.formatError(error)}`));
				});
				process.exit(1);
			}

			console.log(chalk.green("✅ Compilation réussie!"));

			// Exécuter le code JavaScript généré
			console.log(chalk.yellow("🏃 Exécution..."));
			console.log(chalk.gray("─".repeat(50)));

			try {
				// Créer un fichier temporaire et l'exécuter
				const tempFile = join(process.cwd(), "temp_output.js");
				writeFileSync(tempFile, result.output || "");

				// Importer et exécuter le module
				await import(`file://${tempFile}`);

				// Nettoyer le fichier temporaire
				// Note: Dans un environnement de production, vous voudriez gérer cela différemment
			} catch (execError) {
				console.log(chalk.red("💥 Erreur lors de l'exécution:"));
				console.log(
					chalk.red(
						execError instanceof Error ? execError.message : "Erreur inconnue",
					),
				);
				process.exit(1);
			}
		} catch (error) {
			console.log(chalk.red("💥 Erreur fatale:"));
			console.log(
				chalk.red(error instanceof Error ? error.message : "Erreur inconnue"),
			);
			process.exit(1);
		}
	});

// Commande check
program
	.command("check")
	.description(
		"Vérifier la syntaxe et afficher des informations sur un fichier AlgoLang",
	)
	.argument("<file>", "Fichier source AlgoLang (.algo)")
	.option("-v, --verbose", "Mode verbeux")
	.action(async (file: string, options) => {
		try {
			console.log(chalk.blue("🔍 AlgoLang Checker v1.0.0"));
			console.log(chalk.gray(`Analyse de: ${file}`));

			// Lire le fichier source
			const sourceCode = readFileSync(file, "utf-8");

			// Créer le compilateur
			const compiler = new AlgoLangCompiler({ pedagogicalMode: true });

			// Valider la syntaxe
			console.log(chalk.yellow("📋 Validation de la syntaxe..."));
			const validation = compiler.validateSyntax(sourceCode);

			if (validation.valid) {
				console.log(chalk.green("✅ Syntaxe valide!"));
			} else {
				console.log(chalk.red("❌ Erreurs de syntaxe trouvées:"));
				validation.errors.forEach((error) => {
					console.log(chalk.red(`  • ${compiler.formatError(error)}`));
				});
			}

			if (options.verbose) {
				// Obtenir la table des symboles
				console.log(chalk.yellow("\n📊 Analyse sémantique:"));
				const symbolTable = compiler.getSymbolTable(sourceCode);

				if (symbolTable.symbols.size > 0) {
					console.log(chalk.cyan("Variables déclarées:"));
					symbolTable.symbols.forEach((symbol: any, name: string) => {
						console.log(
							chalk.gray(
								`  • ${name}: ${symbol.type} (scope: ${symbol.scope})`,
							),
						);
					});
				} else {
					console.log(chalk.gray("  Aucune variable déclarée"));
				}

				// Statistiques du code
				const lines = sourceCode.split("\n").length;
				const words = sourceCode
					.split(/\s+/)
					.filter((word) => word.length > 0).length;

				console.log(chalk.cyan("\n📈 Statistiques:"));
				console.log(chalk.gray(`  • Lignes de code: ${lines}`));
				console.log(chalk.gray(`  • Mots: ${words}`));
				console.log(chalk.gray(`  • Caractères: ${sourceCode.length}`));
			}
		} catch (error) {
			console.log(chalk.red("💥 Erreur lors de l'analyse:"));
			console.log(
				chalk.red(error instanceof Error ? error.message : "Erreur inconnue"),
			);
			process.exit(1);
		}
	});

// Commande init
program
	.command("init")
	.description("Créer un nouveau projet AlgoLang")
	.argument("<name>", "Nom du projet")
	.option(
		"-t, --template <template>",
		"Template à utiliser (basic|hello|calculator)",
		"basic",
	)
	.action(async (name: string, options) => {
		try {
			console.log(chalk.blue("📦 Création du projet AlgoLang"));
			console.log(chalk.gray(`Nom: ${name}`));
			console.log(chalk.gray(`Template: ${options.template}`));

			// Templates de base
			const templates: Record<string, string> = {
				basic: `program ${name};
begin
  // Votre code ici
end.`,

				hello: `program ${name};
var
  message: string;
begin
  message := "Bonjour, AlgoLang!";
  write(message);
end.`,

				calculator: `program ${name};
var
  a, b, resultat: integer;
begin
  write("Entrez le premier nombre: ");
  read(a);
  
  write("Entrez le deuxième nombre: ");
  read(b);
  
  resultat := a + b;
  write("Le résultat est: ");
  write(resultat);
end.`,
			};

			const template = templates[options.template] || templates.basic;

			// Créer le fichier principal
			const fileName = `${name}.algo`;
			writeFileSync(fileName, template || "");

			console.log(chalk.green("✅ Projet créé avec succès!"));
			console.log(chalk.cyan(`📁 Fichier créé: ${fileName}`));
			console.log(chalk.gray("\nPour commencer:"));
			console.log(chalk.gray(`  algolang run ${fileName}`));
			console.log(chalk.gray(`  algolang compile ${fileName}`));
		} catch (error) {
			console.log(chalk.red("💥 Erreur lors de la création du projet:"));
			console.log(
				chalk.red(error instanceof Error ? error.message : "Erreur inconnue"),
			);
			process.exit(1);
		}
	});

// Gérer les erreurs globales
process.on("uncaughtException", (error) => {
	console.log(chalk.red("💥 Erreur non capturée:"));
	console.log(chalk.red(error.message));
	process.exit(1);
});

process.on("unhandledRejection", (reason) => {
	console.log(chalk.red("💥 Promesse rejetée non gérée:"));
	console.log(chalk.red(String(reason)));
	process.exit(1);
});

// Parser les arguments
program.parse();
