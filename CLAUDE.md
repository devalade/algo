# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install
bun install

# Build compiler CLI
bun run build

# Test all packages
bun test

# Test single file
bun test packages/compiler/tests/lexer.test.ts

# Test by name filter
bun test --filter "Lexer - Tokenize basic"

# Run an .algo program
bun run packages/compiler/src/cli.ts run <file.algo>

# Compile to JS
bun run packages/compiler/src/cli.ts compile <file.algo>

# Syntax check only
bun run packages/compiler/src/cli.ts check <file.algo>

# Lint / Format
bunx @biomejs/biome check src/
bunx @biomejs/biome format --write src/

# Build LSP server
bun build src/server.ts --outdir dist --target node   # from packages/lsp-server/

# Build VS Code extension
tsc -p ./   # from packages/vscode-extension/

# Compile native binaries (from root)
bun run compile:linux
bun run compile:windows
bun run compile:darwin
```

## Architecture

Bun workspaces monorepo with 3 packages:

```
packages/
  compiler/        Core compiler: Lexer → Parser → CodeGenerator → JavaScript
  lsp-server/      Language Server Protocol server (depends on @algolang/compiler)
  vscode-extension/  VS Code Language Client (launches lsp-server, uses tsc not bun)
```

### Compiler Pipeline (`packages/compiler/src/`)

1. **Lexer** (`lexer/lexer.ts`) — hand-written scanner. Tokenizes French keywords (`programme`, `si`, `tantque`, `pour`, `jusqu'à`, etc.) into `TokenType` enum values. Supports accented identifiers, `//` and `/* */` comments, `:=` assignment.
2. **Parser** (`parser/parser.ts`) — recursive descent. Builds `ASTNode` tree using `NodeType` enums. Expression precedence: Or → And → Equality → Relational → Additive → Multiplicative → Unary → Primary. Populates `SymbolTable` during parsing.
3. **CodeGenerator** (`codegen/codegen.ts`) — walks AST, emits JavaScript. Maps `=` → `===`, `et` → `&&`, `ou` → `||`, `repeter...jusqu'à` → `do...while`. Generated code uses `readline` for I/O.
4. **Orchestrator** (`compiler.ts`) — `AlgoLangCompiler` class chains all 3 phases. Also provides `validateSyntax()` and `getSymbolTable()`.
5. **Types** (`types/index.ts`) — all shared types: `TokenType` (33 members), `NodeType` (16 members), `DataType`, `Token`, `ASTNode`, `SymbolTable`, `CompilationError`, `CompilerOptions`, `CompiledOutput`.
6. **CLI** (`cli.ts`) — Commander.js with `compile`, `run`, `check`, `init` subcommands.

### LSP Server (`packages/lsp-server/src/server.ts`)

Single-file server. Imports Lexer/Parser from `@algolang/compiler`. Provides diagnostics (on every edit), keyword completion, hover docs, and basic indentation formatting.

### VS Code Extension (`packages/vscode-extension/`)

Thin Language Client for `.algo` files. Launches LSP server via IPC. Built with `tsc` (CommonJS target, not bun). TextMate grammar in `syntaxes/algolang.tmLanguage.json`.

## Path Aliases

Defined in `tsconfig.json`, used throughout the compiler:

| Alias | Resolves to |
|-------|-------------|
| `@/*` | `src/*` |
| `@/types` | `src/types/index.ts` |
| `@/lexer/*` | `src/lexer/*` |
| `@/parser/*` | `src/parser/*` |
| `@/codegen/*` | `src/codegen/*` |

## Code Style

- TypeScript strict mode. Interfaces over type aliases.
- PascalCase classes/types, camelCase variables/functions.
- French for user-facing messages and error strings, English for internal comments.
- Structured errors: always include `line`, `column`, `position`, `code` fields in `CompilationError`.
- `à` and `jusqu'à` are valid keywords (Unicode-aware lexer).
- `a` is a reserved keyword (used in `pour` loops) — cannot be used as a variable name.

## AlgoLang Keywords Reference

`programme`, `debut`, `fin`, `var`, `entier`, `reel`, `booleen`, `chaine`, `si`, `alors`, `sinon`, `finsi`, `tantque`, `faire`, `fintantque`, `pour`, `allant`, `de`, `à`, `finpour`, `repeter`, `jusqu'à`, `lire`, `ecrire`, `vrai`, `faux`, `et`, `ou`, `non`
