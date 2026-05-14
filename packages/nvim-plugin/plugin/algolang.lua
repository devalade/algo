-- Auto-setup with defaults. Disable with: vim.g.algolang_auto_setup = false
if vim.g.algolang_auto_setup == false then
	return
end

require("algolang").setup(type(vim.g.algolang_opts) == "table" and vim.g.algolang_opts or {})
