# Sketchy - Cortex CMS Rich Text Editor

- This package is used within our Retool CMS as our Rich Text Editor for cards, etc.
- We have reused Contentful's rich text field editor (minus their sdk) to enable us to use contentful's rich text renderer on the frontend for displaying our rich text content on mobile and web. 
  - This allows us to use a single rich text format between our frontend, backend and database.
- This package is based on the [Retool custom component guide](https://github.com/tryretool/custom-component-guide) and largely uses the [Contentful Rich Text Field Editor](https://github.com/contentful/field-editors) (with it's sdk stripped out).
- Retool component guide [README](./Retool-README.md)
- Field Editors [README](./FieldEditors-README.md)
- Rich Text Editor [README](./RichText-README.md)
- [More Info](https://coda.io/d/Product-Project-Cortex_dhy-qH2Cem5/Retool-Learnings-Best-Practices_suL_Z#_lu7Mn)

How to develop / test:
- Run `yarn playground` and open `http://localhost:8081`. This loads the editor in a local iframe with a mocked Retool model (`initialValue`, `height`, `controls`) so you can iterate without Retool.
- To test against a real Retool app instead: run `yarn dev` (serves `localhost:8080/index.js`) and point the custom component iframe script at that URL.

How to build:
- `yarn`
- `yarn prod`

How to release:
- Once your updates have been completed, make a PR to the main branch (will be updated in the future to development to match other repos)
- After merge, create a new "release" without github with an updated tag - this is required to have the cdn link update properly
- Copy the tag used for the release and update the script tags within the Retool module/s to use the updated tag version.
