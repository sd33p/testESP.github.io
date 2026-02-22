document.addEventListener("DOMContentLoaded", function () {
  // --- Build sidebar from existing TOC links ---
  var tocHeading = document.getElementById("contents");
  if (tocHeading) {
    var nav = document.createElement("nav");
    nav.id = "sidebar";

    var title = document.createElement("div");
    title.className = "sidebar-title";
    title.textContent = "Contents";
    nav.appendChild(title);

    // Collect all <p><a href="#..."> siblings after the Contents heading
    var sibling = tocHeading.nextElementSibling;
    while (sibling && !sibling.matches("h1, h2, h3, h4, h5, h6")) {
      var link = sibling.querySelector("a[href^='#']");
      if (link) {
        var item = document.createElement("a");
        item.href = link.getAttribute("href");
        // Get text without the page-number <span>
        item.textContent = link.textContent.replace(/\s*\d+\s*$/, "").trim();
        // Determine indent level from section numbering (e.g. "3.2.1" = 3 parts = h3)
        var numMatch = item.textContent.match(/^[\d.]+/);
        if (numMatch) {
          var depth = numMatch[0].split(".").filter(Boolean).length;
          if (depth >= 3) item.className = "sidebar-h3";
          else if (depth >= 2) item.className = "sidebar-h2";
        }
        // Click handler: open collapsed parent <details> and smooth-scroll
        item.addEventListener("click", function (e) {
          e.preventDefault();
          var targetId = this.getAttribute("href").substring(1);
          var target = document.getElementById(targetId);
          if (target) {
            // Open this element if it's a <details>
            if (target.tagName === "DETAILS") target.open = true;
            // Open all ancestor <details> elements
            var parent = target.parentElement;
            while (parent) {
              if (parent.tagName === "DETAILS") parent.open = true;
              parent = parent.parentElement;
            }
            target.scrollIntoView({ behavior: "smooth" });
          }
        });
        nav.appendChild(item);
      }
      sibling = sibling.nextElementSibling;
    }

    document.body.prepend(nav);
  }

  // --- Collapsible headings (bottom-up for proper nesting) ---
  for (var level = 6; level >= 1; level--) {
    var headings = document.querySelectorAll("h" + level);

    headings.forEach(function (heading) {
      var details = document.createElement("details");
      var summary = document.createElement("summary");

      summary.innerHTML = heading.innerHTML;
      details.appendChild(summary);
      details.open = true;

      // Preserve id and class for anchor links and styling
      if (heading.id) details.id = heading.id;
      if (heading.className) details.className = heading.className;
      details.dataset.headingLevel = level;

      // Collect all siblings until the next heading of same or higher level.
      var sib = heading.nextElementSibling;
      while (sib) {
        var match = sib.tagName.match(/^H([1-6])$/i);
        if (match && parseInt(match[1]) <= level) break;
        var next = sib.nextElementSibling;
        details.appendChild(sib);
        sib = next;
      }

      heading.replaceWith(details);
    });
  }
});
