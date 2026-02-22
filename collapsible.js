document.addEventListener("DOMContentLoaded", function () {
  // Target all headings you want to be collapsible (h1, h2, h3 etc.)
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6, h7");

  headings.forEach(function (heading) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");

    // Copy heading content into <summary>
    summary.innerHTML = heading.innerHTML;
    details.appendChild(summary);
    details.open = true; // sections expanded by default

    // Move all sibling elements until the next heading into <details>
    let sibling = heading.nextElementSibling;
    while (sibling && !sibling.matches("h2, h3")) {
      const next = sibling.nextElementSibling;
      details.appendChild(sibling);
      sibling = next;
    }

    // Replace the original heading with the new <details> block
    heading.replaceWith(details);
  });
});