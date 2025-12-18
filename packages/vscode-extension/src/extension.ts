import * as path from "path";
import { workspace, ExtensionContext } from "vscode";

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    // Le serveur est implémenté en node
    const serverModule = context.asAbsolutePath(
        path.join("..", "lsp-server", "dist", "server.js"),
    );

    // Les options de débogage pour le serveur
    // --inspect=6009: permet de déboguer le serveur sur le port 6009
    const debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };

    // Si l'extension est lancée en mode debug, alors le serveur est lancé avec les options de debug
    // Sinon, il est lancé normalement
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions,
        },
    };

    // Options du client de langue
    const clientOptions: LanguageClientOptions = {
        // Enregistrer le serveur pour les documents AlgoLang
        documentSelector: [{ scheme: "file", language: "algolang" }],
        synchronize: {
            // Notifier le serveur si les fichiers dans le workspace changent (.algolangrc par exemple)
            fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
        },
    };

    // Créer le client de langue et le lancer.
    client = new LanguageClient(
        "algolangLanguageServer",
        "AlgoLang Language Server",
        serverOptions,
        clientOptions,
    );

    // Lancer le client. Cela lancera également le serveur.
    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
