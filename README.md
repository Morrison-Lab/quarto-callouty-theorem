# callouty-theorem extension for Quarto

This Quarto extension wraps your theorems and proofs in callout blocks for better visual appeal.

- [Repository](https://github.com/sun123zxy/quarto-callouty-theorem)
- [Live Demo](https://sun123zxy.github.io/quarto-callouty-theorem)

## Installation

```bash
quarto add sun123zxy/quarto-callouty-theorem
```

This will install the extension under the `_extensions` subdirectory. If you're using version control, you may want to check in this directory.

Modify the YAML front matter of your document or `_quarto.yml` to include the extension. In most scenarios, you may only wish to enable this extension for HTML output like so:

```yaml
format:
  html:
    filters:
      - callouty-theorem
```

Though you can also enable it globally for all formats:

```yaml
filters:
  - callouty-theorem
```

## Usage & Examples

Here is a typical configuration:

```yaml
callouty-theorem:
  proof: # Type of the theorem or proof. Note that for theorems 3-letter abbreviation (`thm`, etc.) should be used
    override-title: true # Whether to override the title of the callout block by the name of the theorem or proof
    callout: # Configuration for the callout block. Refer to Quarto's Callout documentation for more information
      type: note
      appearance: default
      collapse: true
      icon: true
```

Above will wrap all proofs into collapsable callout blocks with its icon and an overrided title. 

Since 1.4.0 the defaults put the type, number and name of a theorem-type or proof-type div on a title bar of its own, apart from the body, and make every wrapped div foldable (open unless `collapse: true`).
So `thm: {callout: {type: note}}` is enough: `override-title` defaults to `true`, `appearance` to `default` and `collapse` to `false`.
Set `override-title: false` (optionally with `title-ref: true`) or `appearance: minimal` to opt out; a `minimal` or `simple` callout has no title bar.
`title-ref: true` only takes effect together with `override-title: false`, because `override-title` is now `true` by default and builds the numbered header itself; on its own `title-ref` does nothing.
Outside HTML (PDF and Word), a theorem-type div keeps its own heading in the body ("Definition 1.1 (name)"), and no stylesheet there can hide it, so since 1.4.1 these types are always a minimal box with that heading, whatever `appearance` or `override-title` says, instead of a title bar that repeats it (or a bar titled "Note").
Proofs, solutions and the other proof-type divs keep their title bar in every format.
Since 1.4.1 the "§" link goes only to a link in the title whose target is the callout itself or the div that opens its body, so a div whose name cites another element ("Solution to @exr-1", or "Proof (see @lem-inner)" for a lemma nested in the proof) keeps that link as it is.
The number in the title bar is plain text followed by a "§" link to the div's `#id`.
Only the label gets the link; a cross-reference inside the name, as in "Solution to Exercise 1", stays an ordinary link.

- In HTML-based formats, a numbered element's header reads "Solution 3 (name)" under `override-title: true` too, and `title-ref: true` works for proofs, remarks and solutions that carry a `#prf-`, `#rem-` or `#sol-` id, so every numbered type can show its type, number and name in the title bar. An unnumbered `.proof` or `.solution` keeps the plain type label. Since 1.2.0, `override-title: true` on a numbered theorem also gives "Theorem 1 (name)", where 1.1.0 gave "Theorem (name)". The "Proof of ..." rule below covers only unnumbered elements; a numbered one keeps its number and shows the name in parentheses. Only ids with a prefix Quarto registers (`thm`, `lem`, `cor`, `prp`, `cnj`, `def`, `exm`, `exr`, `alg`, `prf`, `rem`, `sol`) count as numbered.
- `title-ref: true` (numbered theorem types, with `override-title: false`) puts the numbered label, such as "Example 1 (name)", in the callout header via a cross-reference to the element's own id, so the header is not left with Quarto's default title (the type key, e.g. "Exm"). Since 1.2.1 this applies to HTML-based formats only (including slides), and since 1.2.2 so does the number that `override-title: true` adds to a numbered element's header: PDF and Word have no stylesheet to hide the label repeated in the body, so they keep the body label and Quarto's default header. Hide the label repeated in the body with CSS: `.callout-exm .callout-body .theorem-title { display: none; }`.
- A callout whose header carries the title (`override-title: true` or `title-ref`) does not repeat it in the body: the extension adds a stylesheet that hides the body's theorem or proof title. A name that already starts with the type label, such as "Proof of ...", is used as the whole title rather than "Proof (Proof of ...)".
- With `title-ref`, the header shows the label ("Example 1") as plain text, followed by a small "§" link to the element's `#id`.
  Since 1.2.3 a script makes this swap in the browser, so the label is not itself a hyperlink and its hover preview, which inherited the header's bold type, is gone.
  Bootstrap's fold toggle would swallow a click on the "§", so the script also lets that click through: the anchor follows its link and leaves the fold alone, while the rest of the header and the chevron still fold.
- Hovering a cross-reference to an element inside a callout previews the whole callout, open, with its header and colour bar, rather than the bare inner div.
- Since 1.3.0, figures and tables are supported too, under the keys `fig` and `tbl`.
  A `::: {#fig-x}` div, a figure image with an `#fig-` id, and a table whose caption carries a `{#tbl-x}` id each get wrapped in a callout, and the numbering and `@fig-x` cross-references are unchanged.
  The caption already reads "Figure 1: ...", so there is no `override-title` or `title-ref` for these; use `appearance: minimal`, which draws the colored bar and no header.
  A panel of subfigures is one callout, and its subfigures are not wrapped again.
  A float in the margin (`.column-margin`) is left as it is, since Quarto moves it out of its container.
  Per-div attributes (`appearance`, `collapse`, `icon`, `type`) work as they do for theorems.
  Since 1.4.2, a figure or table is not wrapped in LaTeX (PDF): the callout is a tcolorbox, and a table with many link footnotes (`links-as-notes`) ran the footnote counter past 26 inside it, failing with "Counter too large".
  The caption keeps the float recognizable there; HTML and slides are unchanged.
- You can override callout settings for individual theorem/proof divs by adding attributes directly on the div. Per-div attributes take precedence over the global `callouty-theorem` metadata config.

### Definition list (since 1.5.0)

Set `def-list: true` in a page's or project's metadata, and the page ends with a "Definitions on this page" list: one entry per `#def-` div, in page order, linked to the div.
Included subfiles count, because the filter reads the rendered document.
`def-list-title` changes the heading.
The filter is off by default.

See the source code of [example.qmd](example.qmd) for details.

## License

This extension is licensed under the [MIT License](LICENSE).