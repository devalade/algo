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
                    start: { line: error.line - 1, character: error.column - 1 },
                    end: { line: error.line - 1, character: error.column + 10 }, // Approximation
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
            { label: "entier", kind: CompletionItemKind.Type },
            { label: "reel", kind: CompletionItemKind.Type },
            { label: "booleen", kind: CompletionItemKind.Type },
            { label: "chaine", kind: CompletionItemKind.Type },
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

// Écouter sur la connexion
connection.listen();
