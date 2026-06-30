# Boomer Automation Website

This repository contains the official marketing website for **Boomer Automation Inc.** The site is a custom-built, responsive, performance-focused marketing platform designed to present the company’s services, systems, process, portfolio, company background, privacy policy, and contact pathways with a strong emphasis on lead generation and conversion.

---

## Overview

Boomer Automation Inc. provides digital growth systems for businesses that need stronger websites, better search visibility, paid advertising support, workflow automation, and clearer lead capture infrastructure.

The website is designed to communicate the company’s value proposition through a premium visual interface, structured page content, clear calls to action, and service-focused messaging. The redesign moves the site beyond a basic brochure layout and positions Boomer Automation as a provider of connected business systems.

The site highlights how websites, SEO, Google Ads, conversion tracking, CRM workflows, lead funnels, portfolio proof, and automation can work together as one complete digital growth engine.

---

## Core Pages

* **Home** — Primary landing page introducing Boomer Automation’s value proposition, service categories, automation benefits, and conversion-focused calls to action.
* **Services** — Overview of the company’s core offerings, including workflow automation, website creation/redesign, Google Ads, SEO, and support.
* **Systems** — High-impact page explaining how individual services connect into complete business growth systems.
* **Process** — Breakdown of the company’s workflow, including audit, planning, build, launch, tracking, optimization, and maintenance.
* **Portfolio** — Case studies and website project examples showing previous builds, business positioning, digital marketing value, and conversion-focused web design.
* **About** — Company background, mission, team strengths, operating philosophy, and the value Boomer Automation brings to growing businesses.
* **Contact** — Netlify-compatible contact page with business information, service inquiry fields, honeypot spam protection, and conversion-focused layout.
* **Privacy Policy** — Privacy page explaining how the site handles form submissions, business communications, analytics, advertising tools, cookies, and personal information.

---

## Capabilities Highlighted

* Custom website design and redesign
* Mobile-first responsive web development
* SEO optimization and search-focused site structure
* Google Ads campaign setup and landing page alignment
* Lead generation and contact form systems
* GA4 and Google Tag Manager conversion tracking foundations
* CRM and workflow automation planning
* Internal notification and follow-up automation concepts
* Service-area business positioning
* Portfolio and case study presentation
* Privacy-conscious business communication practices
* Post-launch maintenance and support messaging

---

## Key Features

* Fully custom static website build
* Mobile-first responsive layouts
* Page-specific CSS and JavaScript files
* Global header and footer partials
* Reusable navigation and contact pathways
* Animated loading screens
* Scroll-based reveal animations
* Parallax image treatments
* Interactive visual sections
* Portfolio case study cards
* Blog-style digital marketing insight section
* Conversion-focused calls to action
* Netlify-compatible form structure
* Honeypot spam protection on the contact form
* SEO metadata on core pages
* Open Graph and Twitter card metadata
* JSON-LD structured data where appropriate
* `robots.txt` for crawler access rules
* `sitemap.xml` for search engine discovery
* Netlify `_headers` file for security and cache-control rules
* Versioned static assets for cache control

---

## Technology Stack

* HTML5
* CSS3
* Vanilla JavaScript
* Netlify Forms
* Netlify hosting support
* GitHub / GitHub Pages preview workflow

This project does not rely on a front-end framework. The redesign uses custom HTML, custom CSS, and vanilla JavaScript for performance, control, and portability.

---

## Design Approach

The redesign uses a dark, premium, technology-forward visual system with neon-inspired accents, layered gradients, glass-style surfaces, animated interface elements, and strong editorial spacing.

The design direction is intended to feel modern, high-value, and systems-driven. Motion is used to support engagement without replacing the need for clear content, strong service messaging, portfolio proof, and simple conversion paths.

The site balances visual impact with practical business goals:

* Make the company look credible
* Explain the services clearly
* Show how the services connect
* Present real project examples
* Build trust through company background and process
* Guide users toward contact
* Support future SEO growth
* Provide a strong foundation for paid traffic campaigns

---

## Project Structure

```text
/project-root

├── index.html              # Home / primary landing page
├── services.html           # Services overview
├── systems.html            # Connected systems / growth architecture page
├── process.html            # Company process and workflow
├── portfolio.html          # Portfolio and case studies page
├── about.html              # Company background and mission page
├── contact.html            # Contact form and inquiry page
├── privacy.html            # Privacy policy page
├── thank-you.html          # Optional form submission confirmation page
├── header.html             # Global header partial
├── footer.html             # Global footer partial
├── robots.txt              # Crawler access rules
├── sitemap.xml             # Search engine sitemap
├── _headers                # Netlify security and cache headers

├── assets/
│   ├── css/
│   │   ├── global.v1.css
│   │   ├── home.v1.css
│   │   ├── services.v1.css
│   │   ├── systems.v1.css
│   │   ├── process.v1.css
│   │   ├── portfolio.v1.css
│   │   ├── about.v1.css
│   │   ├── contact.v1.css
│   │   └── privacy.v1.css
│   │
│   └── js/
│       ├── global.v1.js
│       ├── home.v1.js
│       ├── services.v1.js
│       ├── systems.v1.js
│       ├── process.v1.js
│       ├── portfolio.v1.js
│       ├── about.v1.js
│       ├── contact.v1.js
│       └── privacy.v1.js
```

---

## Asset Strategy

CSS and JavaScript files are separated by page to keep the codebase organized and easier to maintain.

Global styles and shared behavior are handled through:

```text
assets/css/global.v1.css
assets/js/global.v1.js
```

Page-specific styles and scripts are loaded only where needed:

```text
assets/css/home.v1.css
assets/js/home.v1.js

assets/css/services.v1.css
assets/js/services.v1.js

assets/css/systems.v1.css
assets/js/systems.v1.js

assets/css/process.v1.css
assets/js/process.v1.js

assets/css/portfolio.v1.css
assets/js/portfolio.v1.js

assets/css/about.v1.css
assets/js/about.v1.js

assets/css/contact.v1.css
assets/js/contact.v1.js

assets/css/privacy.v1.css
assets/js/privacy.v1.js
```

The `.v1` naming convention supports future cache-safe versioning. When a file changes significantly, the filename can be incremented, for example from `home.v1.css` to `home.v2.css`, to help avoid stale browser caching.

---

## Header and Footer Partials

The website uses shared header and footer partials:

```text
header.html
footer.html
```

These are loaded through `assets/js/global.v1.js`.

When previewing locally, use a local server such as VS Code Live Server. Opening the HTML files directly through `file://` may prevent partials from loading correctly because browser security rules can block `fetch()` requests.

---

## Local Development

Recommended local preview method:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500/
```

Alternatively, use the VS Code Live Server extension.

---

## Deployment Notes

The site is structured for static hosting and can be deployed through Netlify or GitHub Pages.

For Netlify, the `_headers` file can be used for security headers and cache-control rules.

For GitHub Pages branch previews, internal asset paths should remain relative where possible so files resolve correctly from the repository preview URL.

---

## SEO and Discoverability

The site is prepared with foundational SEO elements, including:

* Unique page titles
* Meta descriptions
* Canonical URLs
* Open Graph metadata
* Twitter card metadata
* JSON-LD structured data where appropriate
* Semantic HTML sections
* Crawlable static page content
* Portfolio/case study content
* Privacy and trust-supporting pages
* `robots.txt`
* `sitemap.xml`

Future SEO improvements should include dedicated service landing pages for higher-intent search terms, such as website design, website redesign, SEO services, Google Ads management, workflow automation, lead generation systems, CRM automation, and conversion tracking.

---

## Privacy and Compliance Notes

The site includes a dedicated `privacy.html` page explaining how Boomer Automation Inc. may collect and use information from website visitors, form submissions, analytics tools, advertising systems, cookies, and business communications.

The privacy page is intended as a strong operational draft and should be reviewed periodically as the business adds new tools, tracking systems, CRM workflows, email marketing, or third-party integrations.

---

## Notes

This project represents a production-oriented marketing website built to support real client acquisition, business credibility, portfolio proof, privacy transparency, and future search visibility.

The site will continue to be refined for performance, accessibility, SEO, user experience, content depth, and conversion effectiveness.
