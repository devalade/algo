# AlgoLang Agent Guidelines

## Development Commands
- **Build**: `bun run build` (bundles to dist/)
- **Test all**: `bun test`
- **Test single**: `bun test path/to/test.test.ts`
- **Lint**: `bunx @biomejs/biome check src/`
- **Format**: `bunx @biomejs/biome format --write src/`
- **Dev mode**: `bun --watch src/index.ts`

## Code Style Guidelines
- **Language**: TypeScript with strict mode enabled
- **Imports**: Use path aliases (`@/types`, `@/lexer`, `@/parser`, `@/codegen`)
- **Types**: Use interfaces over types, prefer exact optional properties
- **Naming**: PascalCase for classes/types, camelCase for variables/functions
- **Formatting**: 2-space indentation, no semicolons (Biome config)
- **Error handling**: Create structured CompilationError with line/column info
- **Testing**: Bun test framework, arrange-act-assert pattern
- **Comments**: French comments for user-facing messages, English for internal code

## Reserved Keywords
- **Important**: `a` is a reserved keyword (used in `pour` loops: `pour i := 1 a 10 faire`)
- Cannot use `a` as variable name - use alternatives like `aVar`, `aValue`, `aTemp`
- Full list: programme, debut, fin, var, entier, reel, booleen, chaine, si, alors, sinon, finsi, tantque, faire, fintantque, pour, a, finpour, repeter, jusqua, lire, ecrire, vrai, faux, et, ou, non

## Project Architecture
- **Lexer**: Tokenizes French keywords (programme, debut, fin, var, etc.)
- **Parser**: Builds AST using NodeType enums
- **Codegen**: Generates JavaScript with pedagogical comments
- **Types**: Centralized in src/types/index.ts with TokenType/NodeType enums
- **Tests**: Mirror src structure in tests/ with .test.ts extension