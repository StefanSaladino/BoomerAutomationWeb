/* Boomer Automation - cross-environment preview compatibility v2 */
(() => {
  'use strict';

  const { protocol, hostname } = window.location;
  const host = hostname.toLowerCase();

  const isPrivateIPv4 =
    /^10(?:\.\d{1,3}){3}$/.test(host) ||
    /^192\.168(?:\.\d{1,3}){2}$/.test(host) ||
    /^172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}$/.test(host);

  const isFilePreview = protocol === 'file:';
  const isLocalPreview =
    isFilePreview ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '[::1]' ||
    host === '::1' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    isPrivateIPv4;
  const isGitHubPages = /(^|\.)github\.io$/i.test(host);

  // Netlify production and Netlify deploy previews run normally.
  if (!isLocalPreview && !isGitHubPages) return;

  const environment = isGitHubPages
    ? 'github-pages'
    : isFilePreview
      ? 'local-file'
      : 'local-server';

  document.documentElement.dataset.hostingPreview = environment;

  // Keep temporary previews out of search indexes without changing the
  // production metadata served by Netlify.
  let robots = document.querySelector('meta[name="robots"]');
  if (!robots) {
    robots = document.createElement('meta');
    robots.name = 'robots';
    document.head.appendChild(robots);
  }
  robots.content = 'noindex, nofollow, noarchive';

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form[data-netlify="true"], form[name="contact"]');
    if (!form) return;

    const status = form.querySelector('.status-message');
    const submitButton = form.querySelector('[type="submit"]');
    const noteId = 'preview-form-note';

    const environmentLabel = isGitHubPages
      ? 'GitHub Pages team preview'
      : isFilePreview
        ? 'local file preview'
        : 'local server preview';

    if (submitButton) {
      const describedBy = new Set(
        (submitButton.getAttribute('aria-describedby') || '')
          .split(/\s+/)
          .filter(Boolean),
      );
      describedBy.add(noteId);
      submitButton.setAttribute('aria-describedby', [...describedBy].join(' '));
    }

    if (!document.getElementById(noteId)) {
      const note = document.createElement('p');
      note.id = noteId;
      note.className = 'form-note';
      note.textContent = `${environmentLabel}: form delivery is disabled here. The same form remains active when deployed to Netlify.`;
      form.appendChild(note);
    }

    // Native required-field validation still runs before this submit event.
    form.addEventListener(
      'submit',
      event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (status) {
          status.textContent = `Preview only — no inquiry was sent from this ${environmentLabel.toLowerCase()}.`;
        }
      },
      true,
    );
  });
})();
