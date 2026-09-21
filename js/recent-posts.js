// blog.html is the source for post previews. Keep its newest entry first.
(async function loadRecentPosts() {
    const container = document.getElementById("recent-posts");
    if (!container) return;

    try {
        const response = await fetch("blog.html", { cache: "no-cache" });
        if (!response.ok) throw new Error("Blog request failed");

        const blog = new DOMParser().parseFromString(await response.text(), "text/html");
        const previews = Array.from(blog.querySelectorAll("main .post-preview")).slice(0, 3);
        if (!previews.length) return;

        const fragment = document.createDocumentFragment();
        for (const preview of previews) {
            const sourceLink = preview.querySelector("h3 a[href]");
            if (!sourceLink) continue;
            const url = new URL(sourceLink.getAttribute("href"), response.url);
            if (url.origin !== window.location.origin) continue;

            // Build from text instead of importing scripts or markup from the page.
            const card = document.createElement("div");
            card.className = "post-preview";
            const heading = document.createElement("h3");
            const link = document.createElement("a");
            link.href = url.href;
            link.textContent = sourceLink.textContent.trim();
            heading.append(link);
            card.append(heading);

            for (const source of preview.querySelectorAll("p")) {
                const paragraph = document.createElement("p");
                if (source.classList.contains("post-date")) paragraph.className = "post-date";
                paragraph.textContent = source.textContent.trim();
                card.append(paragraph);
            }
            fragment.append(card);
        }
        if (fragment.childElementCount) container.replaceChildren(fragment);
    } catch (error) {
        // Keep the useful Blog link if the network request fails.
        console.warn("Recent posts could not be loaded.", error);
    }
})();
