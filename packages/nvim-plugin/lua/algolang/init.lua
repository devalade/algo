local M = {}

M.defaults = {
	node_cmd = nil,   -- auto-detect from PATH
	server_path = nil, -- defaults to bundled server/server.js
}

local function find_node()
	if vim.fn.executable("node") == 1 then
		return "node"
	end
	-- Common installation paths
	local candidates = {
		"/usr/local/bin/node",
		"/opt/homebrew/bin/node",
		"/usr/bin/node",
	}
	for _, path in ipairs(candidates) do
		if vim.fn.executable(path) == 1 then
			return path
		end
	end
	return nil
end

local function plugin_root()
	-- lua/algolang/init.lua -> go up 3 levels to plugin root
	local source = debug.getinfo(1, "S").source:sub(2)
	return vim.fn.fnamemodify(source, ":h:h:h")
end

function M.setup(opts)
	opts = vim.tbl_deep_extend("force", M.defaults, opts or {})

	local node_cmd = opts.node_cmd or find_node()
	if not node_cmd then
		vim.notify(
			"[algolang] Node.js not found. Install Node.js or set opts.node_cmd.",
			vim.log.levels.WARN
		)
		return
	end

	local server_path = opts.server_path or (plugin_root() .. "/server/server.js")
	if not vim.uv.fs_stat(server_path) then
		vim.notify(
			"[algolang] LSP server not found at: " .. server_path,
			vim.log.levels.ERROR
		)
		return
	end

	vim.lsp.config("algolang", {
		cmd = { node_cmd, server_path, "--stdio" },
		filetypes = { "algo" },
		root_markers = { ".git", "*.algo" },
		single_file_support = true,
	})
	vim.lsp.enable("algolang")
end

return M
