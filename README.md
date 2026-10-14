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

- A numbered element's header reads "Solution 3 (name)" under `override-title: true` too, and `title-ref: true` works for proofs, remarks and solutions that carry a `#prf-`, `#rem-` or `#sol-` id, so every numbered type can show its type, number and name in the title bar. An unnumbered `.proof` or `.solution` keeps the plain type label. Since 1.2.0, `override-title: true` on a numbered theorem also gives "Theorem 1 (name)", where 1.1.0 gave "Theorem (name)". The "Proof of ..." rule below covers only unnumbered elements; a numbered one keeps its number and shows the name in parentheses. Only ids with a prefix Quarto registers (`thm`, `lem`, `cor`, `prp`, `cnj`, `def`, `exm`, `exr`, `alg`, `prf`, `rem`, `sol`) count as numbered.
- `title-ref: true` (numbered theorem types, with `override-title: false`) puts the numbered label, such as "Example 1 (name)", in the callout header via a cross-reference to the element's own id, so the header is not left with Quarto's default title (the type key, e.g. "Exm"). Since 1.2.1 this applies to HTML output only: PDF and Word have no stylesheet to hide the label repeated in the body, so they keep the body label and Quarto's default header. Hide the label repeated in the body with CSS: `.callout-exm .callout-body .theorem-title { display: none; }`.
- A callout whose header carries the title (`override-title: true` or `title-ref`) does not repeat it in the body: the extension adds a stylesheet that hides the body's theorem or proof title. A name that already starts with the type label, such as "Proof of ...", is used as the whole title rather than "Proof (Proof of ...)".
- With `title-ref`, the label in a folding callout's header is a link to the element's `#id`.
  Bootstrap's fold toggle would swallow a click on it, so the extension adds a small script that lets the click through: the label follows its link and leaves the fold alone, while the rest of the header and the chevron still fold.
- You can override callout settings for individual theorem/proof divs by adding attributes directly on the div. Per-div attributes take precedence over the global `callouty-theorem` metadata config.

See the source code of [example.qmd](example.qmd) for details.

## License

This extension is licensed under the [MIT License](LICENSE).