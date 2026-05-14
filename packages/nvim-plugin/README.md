# nvim-algolang

Neovim support for [AlgoLang](https://github.com/devalade/algo) — a French educational programming language.

- Filetype detection for `.algo` files
- Syntax highlighting
- LSP integration (autocompletion, diagnostics, hover, formatting)

## Requirements

- Neovim >= 0.11
- Node.js >= 18 (for the LSP server)

## Installation

### 1. Install the LSP server

```bash
npm install -g @devalade/algolang-lsp
```

### 2. Syntax highlighting

Create the file `~/.config/nvim/syntax/algo.vim` and paste the following:

```vim
if exists("b:current_syntax")
  finish
endif

syn case ignore

syn keyword algoKeyword PROGRAMME DEBUT FIN VAR
syn keyword algoKeyword SI ALORS SINON FINSI
syn keyword algoKeyword TANTQUE FAIRE FINTANTQUE
syn keyword algoKeyword POUR ALLANT DE A FINPOUR
syn keyword algoKeyword REPETER JUSQUA
syn keyword algoType    ENTIER REEL BOOLEEN CHAINE
syn keyword algoBool    VRAI FAUX
syn keyword algoFunc    LIRE ECRIRE
syn keyword algoOp      ET OU NON

syn match   algoNumber  "\b\d\+\(\.\d\+\)\?\b"
syn match   algoAssign  ":="
syn match   algoCompare "<>\|<=\|>=\|<\|>"
syn region  algoString  start='"' end='"'
syn match   algoComment "//.*$"
syn region  algoComment start="/\*" end="\*/"

hi def link algoKeyword Keyword
hi def link algoType    Type
hi def link algoBool    Boolean
hi def link algoFunc    Function
hi def link algoOp      Operator
hi def link algoNumber  Number
hi def link algoAssign  Operator
hi def link algoCompare Operator
hi def link algoString  String
hi def link algoComment Comment

let b:current_syntax = "algo"
```

Then create `~/.config/nvim/ftdetect/algo.vim`:

```vim
au BufRead,BufNewFile *.algo set filetype=algo
```

### 3. Configure the LSP

**LazyVim** — create `~/.config/nvim/lua/plugins/algolang.lua`:

```lua
return {
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        algolang = {
          cmd = { "algolang-lsp", "--stdio" },
          filetypes = { "algo" },
          single_file_support = true,
        },
      },
    },
  },
}
```

**Plain Neovim** — add this to your `init.lua`:

```lua
vim.filetype.add({ extension = { algo = "algo" } })

vim.lsp.config("algolang", {
  cmd = { "algolang-lsp", "--stdio" },
  filetypes = { "algo" },
  root_markers = { ".git", "*.algo" },
  single_file_support = true,
})
vim.lsp.enable("algolang")
```

## With blink.cmp

```lua
{
  "saghen/blink.cmp",
  optional = true,
  opts = function(_, opts)
    opts.sources = opts.sources or {}
    opts.sources.per_filetype = opts.sources.per_filetype or {}
    opts.sources.per_filetype.algo = { "lsp" }
  end,
},
```

## AlgoLang

```algo
PROGRAMME Bonjour;
VAR
  nom: CHAINE;
DEBUT
  ECRIRE("Quel est ton nom ?");
  LIRE(nom);
  ECRIRE("Bonjour,", nom)
FIN
```

Run with: `algolang run fichier.algo`
Install the compiler: `npm install -g @devalade/algolang`
