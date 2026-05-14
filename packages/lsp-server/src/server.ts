import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	TextDocumentSyncKind,
	InitializeResult,
} from "vscode-languageserver/node";

import { TextDocument } from "vscode-languageserver-textdocument";
import { documentStore } from "./document-store.js";
import { register as registerDiagnostics, setDiagnosticCapability } from "./diagnostics.js";
import { register as registerCompletion } from "./completion.js";
import { register as registerHover } from "./hover.js";
import { register as registerFormatting } from "./formatting.js";
import { register as registerSymbols } from "./symbols.js";

// Create connection for the server
const connection = createConnection(ProposedFeatures.all);

// Create simple document manager
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;

	// Check client capabilities
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

	// Pass diagnostic capability to diagnostics module
	setDiagnosticCapability(hasDiagnosticRelatedInformationCapability);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			completionProvider: {
				resolveProvider: true,
			},
			hoverProvider: true,
			documentFormattingProvider: true,
			definitionProvider: true,
			documentSymbolProvider: true,
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

// B3: Add onDidClose handler to clean up maps
documents.onDidClose((event) => {
	documentStore.delete(event.document.uri);
});

connection.onDidChangeWatchedFiles((_change) => {
	connection.console.log("We received a file change event");
});

// Register all feature modules
registerDiagnostics(connection, documents);
registerCompletion(connection, documents);
registerHover(connection, documents);
registerFormatting(connection, documents);
registerSymbols(connection, documents);

// Make document manager listen to connection
documents.listen(connection);

// Listen on connection
connection.listen();
