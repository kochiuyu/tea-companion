# Tea Companion

Quarto website for Tea Companion. Separate from LAE.

Public repo: https://github.com/kochiuyu/tea-companion  
Expected Pages URL (after setup): https://kochiuyu.github.io/tea-companion/

## Render locally

```bash
cd tea-companion
quarto render
# or preview:
quarto preview
```

Requires [Quarto](https://quarto.org/) on your PATH.

## GitHub Pages (self-build)

The workflow [`.github/workflows/publish.yml`](.github/workflows/publish.yml) renders with Quarto and deploys to GitHub Pages on every push to `main` (and on manual **Actions → Quarto Publish → Run workflow**).

**One-time setup in the GitHub UI** (this bot does not change repo settings):

1. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.
2. **Settings → Actions → General → Workflow permissions:** **Read and write permissions** (so the deploy job can publish).
3. Commit and push the workflow file (and site content) to `main`, or trigger the workflow once from the Actions tab.

After the first green run, the site is at `https://kochiuyu.github.io/tea-companion/`.

Rendered output stays in `_site/` and is gitignored; CI rebuilds it on each push.

## Site-owner bot commands

These commands are for the site owner bot (not end users):

| Command | Purpose |
|---------|---------|
| `SCAFFOLD` | Create or refresh empty site structure |
| `BUILD MODULE` | Add a module page from verified materials |
| `PATCH` | Edit existing pages with owner-supplied text |
| `ADD GLOSSARY` | Fill glossary from verified terms |
| `ADD LINKAGES` | Fill cross-branch linkages from verified materials |
| `SANITY` | Check structure / placeholders; do not invent facts |

## Git / publish

Do **not** push or enable Pages from this bot until the user explicitly says **commit these files**.

## Separation

This project is separate from LAE. Do not copy LAE content or facts into this site.
