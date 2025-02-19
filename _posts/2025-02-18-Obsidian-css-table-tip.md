---
layout: blog
title: No-Wrap Specific Columns in Obsidian
section: Blog
last_modified_at: 2025-02-18
categories: Coding
tags:
- Obsidian
- CSS
---

I have a few tables in Obsidian for which I'd like to specify certain columns to
be no-wrap. I'd solved it initially by wrapping long text in those columns with
`<nobr></nobr>`.  Technically I suppose that works, but between
[nobr being deprecated][nobr-gone] and that approach requiring wrapping each
spot of long text manually, I've added the following CSS to my `general.css`
file

```css
.table-c1-nowrap table tr > td:nth-child(1) {
  white-space: nowrap;
}
.table-c2-nowrap table tr > td:nth-child(2) {
  white-space: nowrap;
}
.table-c3-nowrap table tr > td:nth-child(3) {
  white-space: nowrap;
}
.table-c4-nowrap table tr > td:nth-child(4) {
  white-space: nowrap;
}
.table-c5-nowrap table tr > td:nth-child(5) {
  white-space: nowrap;
}
.table-c6-nowrap table tr > td:nth-child(6) {
  white-space: nowrap;
}
.table-c7-nowrap table tr > td:nth-child(7) {
  white-space: nowrap;
}
```
and now I can add any of those css classes to the headmatter of an obsidian
note.

<div class="side-by-side">
<img src="/assets/blog/2025-02-17-Obsidian-css-table-tip/before.png" alt="example before">
<img src="/assets/blog/2025-02-17-Obsidian-css-table-tip/after.png" alt="example after">
</div>

[nobr-gone]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nobr