-- Opt-in companion of callouty-theorem; it runs first because callouty-theorem
-- consumes the definition nodes this filter lists.
-- Append a "Definitions on this page" list to the end of a page.
-- Every #def- div contributes one entry, linked to the div, in page order.
-- Opt in with `def-list: true` in the page or project metadata;
-- `def-list-title` overrides the heading text.
local entries = {}

local function first_header_text(content)
  for _, block in ipairs(content) do
    if block.t == "Header" then
      return pandoc.utils.stringify(block.content)
    end
  end
  return nil
end

-- Quarto turns a #def- div into a Theorem custom node before user filters run,
-- so match that node; its title is `name`, else the first heading.
local function collect(node)
  local id = node.identifier or ""
  if not id:match("^def%-") then return end
  local title
  if node.name and pandoc.utils.stringify(node.name) ~= "" then
    title = pandoc.utils.stringify(node.name)
  else
    title = first_header_text(node.content or {}) or id
  end
  table.insert(entries, { id = id, title = title })
end

function Pandoc(doc)
  local enabled = doc.meta["def-list"]
  if not enabled or pandoc.utils.stringify(enabled) ~= "true" then
    return nil
  end
  if #entries == 0 then return nil end
  local heading = doc.meta["def-list-title"]
      and pandoc.utils.stringify(doc.meta["def-list-title"])
      or "Definitions on this page"
  local items = {}
  for _, e in ipairs(entries) do
    local link = pandoc.Link(e.title, "#" .. e.id)
    table.insert(items, { pandoc.Plain({ link }) })
  end
  doc.blocks:insert(pandoc.Header(2, heading,
    pandoc.Attr("definition-list", { "unnumbered" })))
  doc.blocks:insert(pandoc.BulletList(items))
  return doc
end

return { { Theorem = collect }, { Pandoc = Pandoc } }
