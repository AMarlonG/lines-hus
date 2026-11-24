# Recipe: from zip to a live site on GitHub Pages

Takes about 10 minutes. You need a GitHub account and Git installed
(check with `git --version`). Node.js is **not** required for publishing – see
[Do I need Node.js?](#do-i-need-nodejs) further down.

---

## 1. Unzip and open a terminal in the folder

```bash
cd path/to/lines-hus
git log --oneline          # should show the existing commits
```

*(Optional)* put your own name on the commits:

```bash
git config user.name  "Your Name"
git config user.email "you@example.com"
git commit --amend --reset-author --no-edit
```

## 2. Create an empty repository on GitHub

1. Go to <https://github.com/new>
2. **Repository name:** `lines-hus` (any name works – it becomes part of the URL)
3. **Visibility:**
   - *Public* → GitHub Pages works on every plan, and **anyone with the link can see the house.**
   - *Private* → the code is hidden, but GitHub Pages on a private repo needs a paid plan
     (GitHub Pro/Team), and the published site is still public unless you are on Enterprise.
4. **Do not** tick "Add a README", ".gitignore" or "license" (the repo must be empty).
5. Click **Create repository** and copy the URL it shows, e.g.
   `https://github.com/YOUR-USERNAME/lines-hus.git`

## 3. Push the code

```bash
git remote add origin https://github.com/YOUR-USERNAME/lines-hus.git
git branch -M main
git push -u origin main
```

If Git asks for a password, use a **personal access token** (GitHub → Settings → Developer settings
→ Personal access tokens), or sign in with GitHub Desktop / `gh auth login` instead.

## 4. Turn on GitHub Pages (one time)

1. In the repo on GitHub: **Settings → Pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

That's it – the workflow in `.github/workflows/pages.yml` does the rest.

## 5. Wait for the first deploy

1. Open the **Actions** tab. A run called *Deploy to GitHub Pages* appears (if it started before you
   changed the setting in step 4 and failed, click it → **Re-run all jobs**).
2. After 1–2 minutes it turns green. The site is live at:

   **`https://YOUR-USERNAME.github.io/lines-hus/`**

   Direct links to each house also work:
   `…/lines-hus/#v1`, `…/#v2-1`, `…/#v2-2`, `…/#v3`

---

## Do I need Node.js?

| What you want to do | Node.js needed? |
|---|---|
| Look at the house – open `dist/index.html` in a browser | No |
| Publish to GitHub Pages (steps 1–5 above) | No – GitHub builds it |
| Edit `src/` and preview the result on your own machine before pushing | **Yes** |

You *can* edit `src/` and push without Node.js – GitHub will build and publish it – you just won't
see the result until the site updates.

### Installing Node.js (one time)

1. Go to <https://nodejs.org> and download the **LTS** version for your system (Mac or Windows).
2. Run the installer and accept the defaults.
3. Open a **new** terminal (Terminal on Mac, PowerShell on Windows) and check:
   ```bash
   node --version     # should print v18 or newer
   npm --version
   ```
4. In the `lines-hus` folder, download the dependencies (Three.js + the build tool):
   ```bash
   npm install
   ```
   This creates a large `node_modules/` folder. It is in `.gitignore`, so it never goes to GitHub.

## Updating the site later

Edit files in `src/` (for example a layout in `src/versions.js`), then:

```bash
npm run build        # rebuilds dist/index.html – open it in a browser to check
git add -A
git commit -m "Describe the change"
git push
```

Every push to `main` rebuilds and republishes automatically (watch the **Actions** tab).

## Troubleshooting

| Problem | Fix |
|---|---|
| Action fails at *Deploy* with "Pages not enabled" | Do step 4, then re-run the job. |
| `npm` / `node` "command not found" | Install Node.js (see above) and open a **new** terminal window. |
| `npm ci` fails in the Action | Make sure `package-lock.json` was committed (`git ls-files package-lock.json`). |
| Site shows 404 | Wait a minute and hard-refresh; check the URL ends with `/lines-hus/` (the repo name). |
| `git push` rejected | The GitHub repo wasn't empty. Run `git pull --rebase origin main`, then push again. |
| Want a custom domain | Settings → Pages → Custom domain (and add a DNS CNAME record at your domain provider). |
