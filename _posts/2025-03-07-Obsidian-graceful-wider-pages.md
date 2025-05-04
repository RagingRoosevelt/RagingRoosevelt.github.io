---
layout: blog
title: Graceful page widening in Obsidian
section: Blog
last_modified_at: 2025-05-03
categories: Coding
tags:
- Obsidian
- CSS
---

I've been trying to find a graceful way to widen the content in Obsidian when I
give it more space.  I'd previously tried using a custom CSS class that I could
apply to pages and it would set a larger value for `--file-line-width`, but
when I shrunk the pane size, I was still stuck with this larger size.  I also
didn't like that I had to manual set this class on each page I wanted larger.

<!--more-->

I had tried setting a media query for max-width, but Obsidian has the entire
app as a single viewport, so the media query cues off of the wrong thing.

I recently stumbled into the MDN page for [CSS Container Queries][css-c-queries]
and realized they were what I needed.  They let you define a element in the DOM
to be the container you're cuing off of rather than using the viewport.

[css-c-queries]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries

With this, I can set Obsidian's file viewport `.view-content` to be a container
and then based on a few breakpoint sizes, resize the `--file-line-width` to
resize the page.

Anyhow, here's the CSS snippet I used.  It works nicely on a landscape phone,
and on desktop as you resize the page's pane.


```css
.view-content {
  container-type: size;
  container-name: custom-css;
}
@container custom-css (min-width: 900px) {
  div:is(.cm-sizer,.markdown-preview-sizer) {
    --file-line-width: 900px;
  }
}
@container custom-css (min-width: 1000px) {
  div:is(.cm-sizer,.markdown-preview-sizer) {
    --file-line-width: 1000px;
  }
}
@container custom-css (min-width: 1100px) {
  div:is(.cm-sizer,.markdown-preview-sizer) {
    --file-line-width: 1100px;
  }
}
@container custom-css (min-width: 1200px) {
  div:is(.cm-sizer,.markdown-preview-sizer) {
    --file-line-width: 1200px;
  }
}
```
