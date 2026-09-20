const treeElement = document.getElementById("notes-tree");
const viewerElement = document.getElementById("note-viewer");
const welcomeElement = document.getElementById("notes-welcome");
const breadcrumbsElement = document.getElementById("notes-breadcrumbs");
const sidebarElement = document.getElementById("notes-sidebar");
const menuButton = document.getElementById("notes-menu-button");

let notesIndex = [];

const icons = {
    folder: `
        <svg class="tree-folder-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path fill="currentColor" d="M1.75 2.5h4.1l1.2 1.5h7.2c.69 0 1.25.56 1.25 1.25v7A1.25 1.25 0 0 1 14.25 13.5H1.75A1.25 1.25 0 0 1 .5 12.25v-8.5C.5 3.06 1.06 2.5 1.75 2.5Z"/>
        </svg>`,
    file: `
        <svg class="tree-file-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path fill="currentColor" d="M3.75 1h5.5L13 4.75v9A1.25 1.25 0 0 1 11.75 15h-8.5A1.25 1.25 0 0 1 2 13.75V2.25C2 1.56 2.56 1 3.25 1h.5Zm5 1.5v3h3L8.75 2.5ZM4.5 8v1h6V8h-6Zm0 2.5v1h6v-1h-6Z"/>
        </svg>`
};

function createTreeItem(item, pathLabels = []) {
    const listItem = document.createElement("li");

    if (item.type === "folder") {
        const button = document.createElement("button");
        const children = document.createElement("ul");
        const isTopLevel = pathLabels.length === 0;

        button.type = "button";
        button.className = "tree-folder-button";
        button.setAttribute("aria-expanded", String(isTopLevel));
        button.innerHTML = `<span class="tree-chevron">▶</span>${icons.folder}<span>${item.name}</span>`;

        children.className = "tree-children";
        children.hidden = !isTopLevel;

        item.children.forEach((child) => {
            children.appendChild(createTreeItem(child, [...pathLabels, item.name]));
        });

        button.addEventListener("click", () => {
            const willOpen = button.getAttribute("aria-expanded") !== "true";
            button.setAttribute("aria-expanded", String(willOpen));
            children.hidden = !willOpen;
        });

        listItem.append(button, children);
        return listItem;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "tree-file-button";
    button.dataset.slug = item.slug;
    button.innerHTML = `${icons.file}<span>${item.name}</span>`;
    button.addEventListener("click", () => openNote(item.slug));
    listItem.appendChild(button);
    return listItem;
}

function findNote(items, slug, trail = []) {
    for (const item of items) {
        if (item.type === "file" && item.slug === slug) {
            return { item, trail: [...trail, item.name] };
        }

        if (item.type === "folder") {
            const result = findNote(item.children, slug, [...trail, item.name]);
            if (result) return result;
        }
    }

    return null;
}

function expandActivePath(button) {
    let parent = button.parentElement?.parentElement;

    while (parent && parent !== treeElement) {
        if (parent.classList.contains("tree-children")) {
            parent.hidden = false;
            parent.previousElementSibling?.setAttribute("aria-expanded", "true");
        }
        parent = parent.parentElement;
    }
}

function setActiveFile(slug) {
    document.querySelectorAll(".tree-file-button").forEach((button) => {
        const isActive = button.dataset.slug === slug;
        button.classList.toggle("is-active", isActive);

        if (isActive) expandActivePath(button);
    });
}

function renderBreadcrumbs(labels) {
    breadcrumbsElement.innerHTML = ["Notes", ...labels]
        .map((label, index, all) => index === all.length - 1 ? `<strong>${label}</strong>` : label)
        .join(" <span aria-hidden=\"true\">/</span> ");
}

async function openNote(slug, pushHistory = true) {
    const result = findNote(notesIndex, slug);

    if (!result) {
        showError("That note could not be found.");
        return;
    }

    viewerElement.hidden = false;
    welcomeElement.hidden = true;
    viewerElement.innerHTML = "<p>Loading note…</p>";
    setActiveFile(slug);
    renderBreadcrumbs(result.trail);

    try {
        const response = await fetch(result.item.file);
        if (!response.ok) throw new Error("Note request failed");

        const markdown = await response.text();
        viewerElement.innerHTML = window.marked
            ? marked.parse(markdown, { gfm: true })
            : `<pre>${escapeHtml(markdown)}</pre>`;

        if (pushHistory) {
            const url = new URL(window.location.href);
            url.searchParams.set("note", slug);
            history.pushState({ slug }, "", url);
        }

        document.title = `${result.item.name} | Andrew's IT & Linux Blog`;
        sidebarElement.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        viewerElement.focus({ preventScroll: true });
    } catch (error) {
        showError("This note could not be loaded. Check that its Markdown file exists and is listed correctly in notes.json.");
    }
}

function escapeHtml(value) {
    return value.replace(/[&<>\"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
    })[character]);
}

function showError(message) {
    welcomeElement.hidden = true;
    viewerElement.hidden = false;
    viewerElement.innerHTML = `<h1>Note unavailable</h1><p>${message}</p>`;
}

async function initializeNotes() {
    try {
        const response = await fetch("notes/notes.json");
        if (!response.ok) throw new Error("Index request failed");

        notesIndex = await response.json();
        treeElement.innerHTML = "";
        notesIndex.forEach((item) => treeElement.appendChild(createTreeItem(item)));

        const slug = new URLSearchParams(window.location.search).get("note");
        if (slug) await openNote(slug, false);
    } catch (error) {
        treeElement.innerHTML = '<li class="notes-status">The notes index could not be loaded.</li>';
        showError("The notes index could not be loaded. This page needs to be viewed through the website rather than opened directly from your computer.");
    }
}

menuButton.addEventListener("click", () => {
    const isOpen = sidebarElement.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
});

window.addEventListener("popstate", () => {
    const slug = new URLSearchParams(window.location.search).get("note");

    if (slug) {
        openNote(slug, false);
    } else {
        viewerElement.hidden = true;
        welcomeElement.hidden = false;
        breadcrumbsElement.textContent = "Notes";
        setActiveFile("");
        document.title = "Notes | Andrew's IT & Linux Blog";
    }
});

initializeNotes();
