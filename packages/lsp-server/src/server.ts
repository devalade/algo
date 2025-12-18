import {
    createConnection,
    TextDocuments,
    Diagnostic,
    DiagnosticSeverity,
    ProposedFeatures,
    InitializeParams,
    DidChangeConfigurationNotification,
    CompletionItem,
    CompletionItemKind,
    TextDocumentPositionParams,
    TextDocumentSyncKind,
    InitializeResult,
} from "vscode-languageserver/node";

import { TextDocument } from "vscode-languageserver-textdocument";

// Importer le compilateur AlgoLang
import { Lexer } from "@algolang/compiler";
import { Parser } from "@algolang/compiler";
import { TokenType } from "@algolang/compiler";

// Créer une connexion pour le serveur
const connection = createConnection(ProposedFeatures.all);

// Créer un gestionnaire de documents simples
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

// Stocker les tables de symboles par URI pour le hover
const symbolTables = new Map<string, any>();
const documentAsts = new Map<string, any>();

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: InitializeParams) => {
    const capabilities = params.capabilities;

    // Vérifier les capacités du client
    hasConfigurationCapability = !!(
        capabilities.workspace && !!capabilities.workspace.configuration
    );
    hasWorkspaceFolderCapability = !!(
        capabilities.workspace && !!capabilities.workspace.workspaceFolders
    );
    hasDiagnosticRelatedInformationCapability = !!(
        capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation
    );

    const result: InitializeResult = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
            // Dire au client que le serveur supporte l'auto-complétion
            completionProvider: {
                resolveProvider: true,
            },
            hoverProvider: true,
            documentFormattingProvider: true,
        },
    };
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true,
            },
        };
    }
    return result;
});

connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        // Enregistrer pour les changements de configuration
        connection.client.register(
            DidChangeConfigurationNotification.type,
            undefined,
        );
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders((_event) => {
            connection.console.log("Workspace folder change event received.");
        });
    }
});

// Le contenu d'un document texte a changé. Cet événement est émis
// lors de l'ouverture du document ou lorsque son contenu change.
documents.onDidChangeContent((change) => {
    validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
    const text = textDocument.getText();
    const diagnostics: Diagnostic[] = [];

    try {
        const lexer = new Lexer(text);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        // Ajouter les erreurs de parsing aux diagnostics
        for (const error of result.errors) {
            const diagnostic: Diagnostic = {
                severity: DiagnosticSeverity.Error,
                range: {
                    start: {
                        line: Math.max(0, error.line - 1),
                        character: Math.max(0, error.column - 1)
                    },
                    end: {
                        line: Math.max(0, error.line - 1),
                        character: Math.max(0, error.column + 9)
                    },
                },
                message: error.message,
                source: "AlgoLang",
            };

            if (hasDiagnosticRelatedInformationCapability && error.explanation) {
                diagnostic.relatedInformation = [
                    {
                        location: {
                            uri: textDocument.uri,
                            range: Object.assign({}, diagnostic.range),
                        },
                        message: error.explanation,
                    },
                ];
            }
            diagnostics.push(diagnostic);
        }
    } catch (error: any) {
        // Erreurs catastrophiques (lexer/parser crash)
        diagnostics.push({
            severity: DiagnosticSeverity.Error,
            range: {
                start: { line: 0, character: 0 },
                end: { line: 0, character: 1 },
            },
            message: error.message || "Erreur interne du serveur AlgoLang",
            source: "AlgoLang",
        });
    }

    // Envoyer les diagnostics calculés à VS Code
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });

    // Stocker pour le hover
    try {
        const lexer = new Lexer(text);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();
        symbolTables.set(textDocument.uri, result.symbolTable);
        documentAsts.set(textDocument.uri, result.ast);
    } catch (e) {
        // Ignorer si ça crash, on garde la version précédente
    }
}

connection.onDidChangeWatchedFiles((_change) => {
    // Monitored files have changed in VS Code
    connection.console.log("We received a file change event");
});

// Fournir l'auto-complétion
connection.onCompletion(
    (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
        // Pour l'instant, on renvoie simplement les mots-clés statiques
        const keywords = [
            { label: "programme", kind: CompletionItemKind.Keyword },
            { label: "debut", kind: CompletionItemKind.Keyword },
            { label: "fin", kind: CompletionItemKind.Keyword },
            { label: "var", kind: CompletionItemKind.Keyword },
            { label: "entier", kind: CompletionItemKind.Class },
            { label: "reel", kind: CompletionItemKind.Class },
            { label: "booleen", kind: CompletionItemKind.Class },
            { label: "chaine", kind: CompletionItemKind.Class },
            { label: "si", kind: CompletionItemKind.Keyword },
            { label: "alors", kind: CompletionItemKind.Keyword },
            { label: "sinon", kind: CompletionItemKind.Keyword },
            { label: "finsi", kind: CompletionItemKind.Keyword },
            { label: "tantque", kind: CompletionItemKind.Keyword },
            { label: "faire", kind: CompletionItemKind.Keyword },
            { label: "pour", kind: CompletionItemKind.Keyword },
            { label: "allant", kind: CompletionItemKind.Keyword },
            { label: "de", kind: CompletionItemKind.Keyword },
            { label: "à", kind: CompletionItemKind.Keyword },
            { label: "repeter", kind: CompletionItemKind.Keyword },
            { label: "jusqu'à", kind: CompletionItemKind.Keyword },
            { label: "lire", kind: CompletionItemKind.Function },
            { label: "ecrire", kind: CompletionItemKind.Function },
            { label: "vrai", kind: CompletionItemKind.Constant },
            { label: "faux", kind: CompletionItemKind.Constant },
        ];

        return keywords as CompletionItem[];
    },
);

// Résoudre des informations supplémentaires pour l'auto-complétion
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
    if (item.label === "programme") {
        item.detail = "Mot-clé programme";
        item.documentation = "Définit le début du programme AlgoLang.";
    } else if (item.label === "ecrire") {
        item.detail = "Fonction d'affichage";
        item.documentation = "Affiche du texte ou des variables dans la console.";
    }
    return item;
});

// Faire en sorte que le gestionnaire de documents écoute la connexion
documents.listen(connection);

// Hover support
connection.onHover((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return null;

    const line = params.position.line;
    const character = params.position.character;
    const text = document.getText();
    const lines = text.split(/\r?\n/);
    const lineText = lines[line];

    // Trouver le mot sous le curseur
    const wordMatch = lineText.slice(0, character).match(/[a-zA-Zàéèîïôûù'0-9_]*$/);
    const wordRestMatch = lineText.slice(character).match(/^[a-zA-Zàéèîïôûù'0-9_]*/);
    if (!wordMatch || !wordRestMatch) return null;

    const word = wordMatch[0] + wordRestMatch[0];
    if (!word) return null;

    // 1. Vérifier si c'est un mot-clé statique
    const keywordDocs: Record<string, string> = {
        "programme": "**programme** : Début d'un programme AlgoLang.",
        "debut": "**debut** : Début du bloc d'instructions principal.",
        "fin": "**fin** : Fin du bloc d'instructions ou du programme.",
        "var": "**var** : Section de déclaration des variables.",
        "entier": "**entier** : Type de donnée pour les nombres entiers.",
        "reel": "**reel** : Type de donnée pour les nombres à virgule.",
        "booleen": "**booleen** : Type de donnée logique (vrai/faux).",
        "chaine": "**chaine** : Type de donnée pour le texte.",
        "si": "**si** : Structure conditionnelle.",
        "alors": "**alors** : Début du bloc exécuté si la condition est vraie.",
        "sinon": "**sinon** : Début du bloc exécuté si la condition est fausse.",
        "finsi": "**finsi** : Fin d'une structure conditionnelle.",
        "tantque": "**tantque** : Boucle répétitive tant qu'une condition est vraie.",
        "faire": "**faire** : Début du corps d'une boucle.",
        "fintantque": "**fintantque** : Fin d'une boucle tantque.",
        "pour": "**pour** : Boucle avec compteur.",
        "finpour": "**finpour** : Fin d'une boucle pour.",
        "repeter": "**repeter** : Boucle exécutée au moins une fois.",
        "jusqu'à": "**jusqu'à** : Condition de fin d'une boucle repeter.",
        "lire": "**lire(variable)** : Lit une valeur depuis l'entrée standard.",
        "ecrire": "**ecrire(...)** : Affiche des valeurs dans la console.",
    };

    if (keywordDocs[word.toLowerCase()]) {
        return {
            contents: {
                kind: "markdown",
                value: keywordDocs[word.toLowerCase()]
            }
        };
    }

    // 2. Vérifier si c'est une variable dans la table des symboles
    const table = symbolTables.get(params.textDocument.uri);
    if (table) {
        const symbol = table.symbols.get(word);
        if (symbol) {
            return {
                contents: {
                    kind: "markdown",
                    value: `(variable) **${symbol.name}** : ${symbol.type}\n\nDéclarée à la ligne ${symbol.line}.`
                }
            };
        }
    }

    return null;
});

// Formatter support (très basique)
connection.onDocumentFormatting((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return [];

    const text = document.getText();
    const lines = text.split(/\r?\n/);
    let indentLevel = 0;
    const tabSize = params.options.tabSize || 2;
    const indent = " ".repeat(tabSize);

    const formattedLines = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return "";

        // Diminuer l'indentation pour les mots-clés de fermeture
        if (trimmed.match(/^(fin|finsi|fintantque|finpour|jusqu'à|sinon)\b/i)) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        const newLine = indent.repeat(indentLevel) + trimmed;

        // Augmenter l'indentation après les mots-clés d'ouverture
        if (trimmed.match(/^(programme|var|debut|si|sinon|tantque|faire|pour|repeter)\b/i)) {
            indentLevel++;
        }

        return newLine;
    });

    return [
        {
            range: {
                start: { line: 0, character: 0 },
                end: { line: lines.length, character: 0 }
            },
            newText: formattedLines.join("\n") + "\n"
        }
    ];
});

// Écouter sur la connexion
connection.listen();
