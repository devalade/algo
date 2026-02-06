# LSP Server Changelog

## v2.0.0 - Full Overhaul (2026-02-06)

### Architecture
- **Modular Structure**: Split 333-line monolithic `server.ts` into 9 focused modules
  - `server.ts` - Connection setup and capability registration
  - `cache.ts` - Typed document state management
  - `keyword-docs.ts` - Single source of truth for all keyword documentation
  - `diagnostics.ts` - Error validation and reporting
  - `completion.ts` - Auto-completion with variables
  - `hover.ts` - Documentation on hover
  - `formatting.ts` - Document formatting
  - `symbols.ts` - Go-to-definition and document symbols
  - `utils.ts` - Shared utilities

### Bug Fixes
1. **Formatter double-indent** (A1)
   - Removed `programme` from indent increase (redundant with `debut`)
   - Removed `faire` from always-indent (only indent when on separate line)
   - Fixed `jusqu'à` regex (word boundary incompatible with apostrophe)

2. **Hardcoded error range** (A2)
   - Replaced `column + 9` with intelligent boundary detection
   - Scans for word/operator boundaries
   - Fallback to 1 character

3. **Double-parse eliminated** (A3)
   - Reuse first parse for both diagnostics and caching
   - Moved cache population inside try block
   - Removed redundant second parse

### Dead Code Cleanup
- Removed unused `TokenType` import (B1)
- Properly typed cache maps with `SymbolTable` and `ASTNode` (B2)
- Added `onDidClose` handler for memory cleanup (B3)

### Feature Improvements

**Completion** (D1-D2)
- Added missing keywords: `fintantque`, `finpour`, `et`, `ou`, `non`
- Added variable completion from symbol table with type detail
- Complete `onCompletionResolve` for all 29 keywords

**Hover** (D4)
- Added documentation for: `allant`, `de`, `à`, `a`, `vrai`, `faux`, `et`, `ou`, `non`
- All keywords now have hover docs
- Variable hover shows type and declaration line

### New Features

**Go-to-Definition** (E1)
- Jump to variable declaration from usage
- Uses symbol table line/column information

**Document Symbols** (E2)
- Outline view shows programme name (Module symbol)
- Lists all variables with types
- Enables breadcrumb navigation

### Test Suite
Created comprehensive test coverage:
- `formatting.test.ts` - 8 tests covering indentation rules
- `completion.test.ts` - Validates all 29 keywords present
- `hover.test.ts` - Verifies documentation coverage
- `diagnostics.test.ts` - Tests error range computation
- `integration.test.ts` - End-to-end with real programs

**Total**: 36 tests, 386 assertions, 100% pass rate

### Build
- Build command unchanged: `bun build src/server.ts --outdir dist --target node`
- Output: `dist/server.js` (421 KB bundled)
- VS Code extension requires no changes

### Breaking Changes
None - fully backward compatible

### Known Limitations
1. Go-to-definition lands on type token, not variable name (acceptable for MVP)
2. Semantic tokens deferred to future work
