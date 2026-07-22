# about_me

Personal portfolio site for Joshua Fortunatus — Staff Data Analyst. Plain
HTML/CSS/JS, no build step, deployed via GitHub Pages.

Live at: https://joshuafortunatus.github.io/about_me/

## Structure

- `index.html` — page content (hero, experience, projects, stack & skills,
  education, interests, AI, contact)
- `css/styles.css` — styling, light/dark theme via `prefers-color-scheme`
- `js/main.js` — nav scroll-spy, reveal-on-scroll, project detail modals, footer year
- `images/` — headshot and other page assets

## Local preview

```
python3 -m http.server 8000
```

then open http://localhost:8000

## Deploy

GitHub Pages is configured to serve from the `main` branch root. Pushing to
`main` publishes automatically — no Actions workflow needed for this static
site.
