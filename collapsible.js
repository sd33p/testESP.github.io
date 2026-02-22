document.addEventListener("DOMContentLoaded", function () {
  // Process from deepest heading level to shallowest.
  // This way, when we wrap an h1, the h2/h3 sections beneath it
  // have already been converted to <details> and get nested inside.
  for (let level = 6; level >= 1; level--) {
    const headings = document.querySelectorAll("h" + level);

    headings.forEach(function (heading) {
      const details = document.createElement("details");
      const summary = document.createElement("summary");

      summary.innerHTML = heading.innerHTML;
      details.appendChild(summary);
      details.open = true;

      // Preserve id and class for anchor links and styling
      if (heading.id) details.id = heading.id;
      if (heading.className) details.className = heading.className;
      details.dataset.headingLevel = level;

      // Collect all siblings until the next heading of same or higher level.
      // Lower-level headings (h2 inside h1, h3 inside h2, etc.) have already
      // been converted to <details> elements so they get captured here.
      let sibling = heading.nextElementSibling;
      while (sibling) {
        const match = sibling.tagName.match(/^H([1-6])$/i);
        if (match && parseInt(match[1]) <= level) break;
        const next = sibling.nextElementSibling;
        details.appendChild(sibling);
        sibling = next;
      }

      heading.replaceWith(details);
    });
  }
});
