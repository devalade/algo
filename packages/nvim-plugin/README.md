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

### 2. Install the plugin

**lazy.nvim**

```lua
{
  "devalade/algo",
  subdir = "packages/nvim-plugin",
  ft = "algo",
}
```

**vim-plug**

```vim
Plug 'devalade/algo', { 'rtp': 'packages/nvim-plugin' }
```

### 3. Configure the LSP

Add this to your Neovim config (e.g. `~/.config/nvim/lua/plugins/algolang.lua` for LazyVim):

```lua
return {
  {
    "devalade/algo",
    subdir = "packages/nvim-plugin",
    ft = "algo",
  },
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

**Without LazyVim**, add this anywhere in your config:

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

If you use [blink.cmp](https://github.com/saghen/blink.cmp), enable LSP completions for `.algo` files:

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

## Options

The plugin auto-sets up the LSP on load. To disable auto-setup and configure manually:

```lua
vim.g.algolang_auto_setup = false

require("algolang").setup({
  node_cmd = "/path/to/node",       -- default: auto-detected from PATH
  server_path = "/path/to/server.js", -- default: bundled server
})
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
