<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This project deploys the built `dist/` folder to the `gh-pages` branch.

1. Install dependencies:
   `npm install`
2. Build and deploy:
   `npm run deploy`

The deploy command runs `npm run build`, then publishes `dist/` to the `gh-pages` branch with `gh-pages -d dist`.

In the GitHub repository settings, go to **Settings > Pages** and use:

- **Source:** Deploy from a branch
- **Branch:** `gh-pages`
- **Folder:** `/ (root)`

After deployment, wait a minute or two, then test:

`https://ludobotics.com/launcher_download_student`

## Hidden SPA Routes

The `/launcher_download_student` page is a React route, not a physical folder in the repository. GitHub Pages needs a `404.html` fallback so direct links can load the app and let React render the correct page.

The build script creates both:

- `dist/index.html`
- `dist/404.html`

If `/launcher_download_student` shows a GitHub-branded 404 after deployment, check that the `gh-pages` branch contains both `index.html` and `404.html` at the branch root.

If testing on a raw GitHub Pages URL such as `https://your-user.github.io/website/launcher_download_student`, remember that the path may include the repository name. The custom domain URL should be:

`https://ludobotics.com/launcher_download_student`
