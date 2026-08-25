# Cortex CMS Rich Text Editor

Retool custom component used as the rich text editor in the Cortex CMS (cards and similar content).

It is Contentful’s rich text field editor with the Contentful SDK removed, so we can author the same [Contentful rich text JSON](https://www.contentful.com/developers/docs/concepts/rich-text/) that mobile and web already render. One format for editor, backend, and database.

The editor is built on [Plate](https://platejs.org/docs) (Plate plugins are supported). See [Plate plugins](https://platejs.org/docs/plugins).

## Local development

From this directory (`cms-rich-text-editor`):

```sh
yarn
yarn playground
```

Open [http://localhost:8081](http://localhost:8081). The playground loads the editor in an iframe with a mocked Retool model (`initialValue`, `controls`), so you can iterate without Retool. Editor height follows the iframe size.

## Development workflow

1. Branch off `main`.
2. Make changes and verify them in the playground (`yarn playground`).
3. When the playground looks right, test in Retool (below) before merging.

## Test in Retool

jsDelivr caches by URL. A **commit hash** is immutable, so you do not need cache-busting after each push. A branch name is not — do not use it for testing.

1. Build: `yarn prod`
2. Commit and push. Copy the **commit hash**.
3. Open the [Retool module: Contentful Rich Text Editor](https://sketchymedical.retool.com/editor/6e455d08-92eb-11ee-8a52-0fc062da2416/Cortex/Contentful%20Rich%20Text%20Editor).
4. Select the `richTextEditor` [component](https://github.com/user-attachments/assets/75ca69b1-31f5-4e38-99b8-cc4268e7a758) in the [component tree](https://github.com/user-attachments/assets/5390c97e-84dd-4791-8bc2-78b955dced89).
5. Open **IFrame Code** and point the `<script>` tag at your commit instead of the release tag. Refresh if it does not load.

   Production (tag):

   ```html
   <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/sketchy/libs-cms@v0.1.7/cms-rich-text-editor/dist/index.js"></script>
   ```

   Testing (commit):

   ```html
   <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/sketchy/libs-cms@{COMMIT_HASH}/cms-rich-text-editor/dist/index.js"></script>
   ```

   Further code changes require another commit, push, and hash update.

[Demo](https://github.com/user-attachments/assets/a86eded1-f258-4749-a3bf-83e465a4204a)

## Release

1. Open a PR to `main` and merge.
2. Create a GitHub **release** with a new tag. jsDelivr needs that tag for the production CDN URL.
3. Copy the tag and update the Retool module’s **IFrame Code** script `src` to that tag (for example `@v0.1.8` instead of the commit hash).

## Retool model

The iframe reads Retool inputs and writes outputs via `modelUpdate`.

**Inputs**

| Key | Description |
| --- | --- |
| `initialValue` | Contentful document JSON (object or JSON string). Empty document if omitted. |
| `controls` | Toolbar buttons to show. Defaults: `bold`, `underline`, `italics`, `superscript`, `subscript`, `list`, `link`, `font-size`. Also available: `table`. |

**Outputs**

| Key | Description |
| --- | --- |
| `value` | Current document as a JSON object |
| `valueStringified` | Same document as a JSON string |
| `valuePlainText` | Plain-text rendering of the document |
| `hasChanged` | `true` after the user edits |

## Further reading

- [Retool custom component guide](https://github.com/tryretool/custom-component-guide) (this package is based on it)
- [Contentful rich text field editor](https://github.com/contentful/field-editors) (source, SDK stripped)
- Local copies: [Retool](./Retool-README.md) · [Field editors](./FieldEditors-README.md) · [Rich text editor](./RichText-README.md)
- [Original spec / Retool notes](https://coda.io/d/Product-Project-Cortex_dhy-qH2Cem5/Retool-Learnings-Best-Practices_suL_Z#_lu7Mn)
