# Header/Footer Partials Fix

This package restores the intended header/footer architecture.

## What changed

- Removed manually inlined header markup from every page.
- Removed manually inlined footer markup from every page.
- Restored each page to the clean mount-only pattern:

```html
<div id="siteHeaderMount"></div>
<div id="siteFooterMount"></div>
```

- Kept `header.html` and `footer.html` as the only source of truth.
- Restored the Boomer icon path inside the partials to:

```html
<img src="./assets/images/Boomer_auto_icon.png" alt="Boomer Automation icon" />
```

- Removed the extra `.brand-mark img` CSS rule from the previous attempted fix, so the CSS is no longer changed for the icon.
- Kept the SEO architecture updates: sitemap fix, redirects, robots, headers, privacy/CRM consent work, counter fallbacks, schema/metadata improvements.

## Why

Manually inlining the header/footer created duplicate sources of truth and caused icon/path bugs. The site now returns to the maintainable partial-loader model while preserving the rest of the SEO improvements.
