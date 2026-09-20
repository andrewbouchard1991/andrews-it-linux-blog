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
