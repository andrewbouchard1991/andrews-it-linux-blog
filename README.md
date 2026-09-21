# andrews-it-linux-blog

My Linux & Networking Journey

## Adding a note

1. Create a Markdown file inside the appropriate folder under `notes/`.
2. Add the note to `notes/notes.json` with its display name, URL slug, and file path.
3. Commit and push the new Markdown file and the updated JSON index.

Example entry:

```json
{
    "name": "Static Routing",
    "type": "file",
    "slug": "ccna/routing/static-routing",
    "file": "notes/ccna/routing/static-routing.md"
}
```

The note will then be available at:

```text
notes.html?note=ccna/routing/static-routing
```

Because the notes page fetches Markdown and JSON files, preview it through a local web server instead of opening `notes.html` directly from the file system.

## Adding a blog post

1. Create the article HTML file in `posts/`.
2. Copy an existing post's `<section>` in `blog.html` and put the new preview first inside `<main>`.
3. Update the preview's link, title, date, and summary. Keep the `post-preview` and `post-date` classes.
4. Preview through VS Code Live Server, then commit and push as usual.

The homepage fetches `blog.html` and displays its first three `.post-preview` entries in the same order. Keep the Blog page newest first; dates are displayed as written, not used for sorting. You do not need to edit `index.html` for each post. Creating an article file alone does not add it to either list.

If JavaScript is disabled or the Blog page cannot be fetched, the homepage provides a link to the Blog page. Opening `index.html` directly with a `file://` URL will also use that fallback; use a local web server for previews.
