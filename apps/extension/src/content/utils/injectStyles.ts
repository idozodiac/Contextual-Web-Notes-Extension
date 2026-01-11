/**
 * Utility to inject compiled CSS into Shadow DOM
 * We'll fetch the CSS from the bundled stylesheet at runtime
 */

export function injectStylesIntoShadow(shadowRoot: ShadowRoot) {
  // Check if styles are already injected
  const existingStyle = shadowRoot.querySelector('style#tailwind-styles');
  if (existingStyle) {
    return;
  }

  try {
    // Try to extract CSS from document stylesheets (content script CSS)
    let cssText = '';
    const stylesheets = Array.from(document.styleSheets);
    
    for (const sheet of stylesheets) {
      try {
        // Check if this is our content script stylesheet
        const href = (sheet as CSSStyleSheet).href || '';
        if (href.includes('index-') && href.includes('.css')) {
          // Try to get all rules
          const rules = Array.from(sheet.cssRules || sheet.rules || []);
          for (const rule of rules) {
            cssText += rule.cssText + '\n';
          }
          break; // Found our stylesheet
        }
      } catch (e) {
        // Cross-origin or access denied, skip
      }
    }

    // If we couldn't extract from stylesheets, try to find CSS link in head
    if (!cssText || cssText.length < 100) {
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      for (const link of links) {
        const href = link.getAttribute('href') || '';
        if (href.includes('index-') && href.includes('.css')) {
          // Try to fetch the CSS file
          fetch(href)
            .then(res => res.text())
            .then(css => {
              const style = shadowRoot.querySelector('style#tailwind-styles') || document.createElement('style');
              style.id = 'tailwind-styles';
              // Ensure animate-spin is included even if not in fetched CSS
              const animationCSS = `
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
                .animate-spin {
                  animation: spin 1s linear infinite;
                }
              `;
              style.textContent = css + '\n' + animationCSS;
              if (!shadowRoot.contains(style)) {
                shadowRoot.insertBefore(style, shadowRoot.firstChild);
              }
            })
            .catch(() => {
              // Fallback to essential styles
              injectEssentialStyles(shadowRoot);
            });
          return; // Will be injected async
        }
      }
      // Fallback to essential styles
      cssText = getEssentialTailwindStyles();
    }

    // Inject CSS synchronously (if we got it from stylesheets)
    if (cssText) {
      const style = document.createElement('style');
      style.id = 'tailwind-styles';
      // Ensure animate-spin is included even if not in extracted CSS
      const animationCSS = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `;
      style.textContent = cssText + '\n' + animationCSS;
      shadowRoot.insertBefore(style, shadowRoot.firstChild);
    } else {
      injectEssentialStyles(shadowRoot);
    }
  } catch (error) {
    console.error('[Contextual Notes] Error injecting styles:', error);
    injectEssentialStyles(shadowRoot);
  }
}

function injectEssentialStyles(shadowRoot: ShadowRoot) {
  const existingStyle = shadowRoot.querySelector('style#tailwind-styles');
  if (existingStyle) {
    existingStyle.textContent = getEssentialTailwindStyles();
    return;
  }

  const style = document.createElement('style');
  style.id = 'tailwind-styles';
  style.textContent = getEssentialTailwindStyles();
  shadowRoot.insertBefore(style, shadowRoot.firstChild);
}

/**
 * Essential Tailwind utilities for the notes
 * This is a fallback if CSS extraction fails
 */
function getEssentialTailwindStyles(): string {
  return `
    /* Essential Tailwind utilities */
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-1 { flex: 1 1 0%; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .justify-end { justify-content: flex-end; }
    .gap-1 { gap: 0.25rem; }
    .w-64 { width: 16rem; }
    .w-4 { width: 1rem; }
    .w-3 { width: 0.75rem; }
    .w-6 { width: 1.5rem; }
    .h-4 { height: 1rem; }
    .h-3 { height: 0.75rem; }
    .h-6 { height: 1.5rem; }
    .bg-yellow-200 { background-color: #fef08a; }
    .bg-yellow-300 { background-color: #fde047; }
    .bg-blue-600 { background-color: #2563eb; }
    .bg-blue-700 { background-color: #1d4ed8; }
    .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
    .hover\\:bg-yellow-400:hover { background-color: #facc15; }
    .text-white { color: #ffffff; }
    .text-black { color: #000000; }
    .text-yellow-700 { color: #a16207; }
    .text-yellow-800 { color: #854d0e; }
    .text-gray-800 { color: #1f2937; }
    .text-gray-500 { color: #6b7280; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-xs { font-size: 0.75rem; line-height: 1rem; }
    .rounded-md { border-radius: 0.375rem; }
    .rounded-full { border-radius: 9999px; }
    .rounded-t-md { border-top-left-radius: 0.375rem; border-top-right-radius: 0.375rem; }
    .rounded-b-md { border-bottom-left-radius: 0.375rem; border-bottom-right-radius: 0.375rem; }
    .border { border-width: 1px; }
    .border-b { border-bottom-width: 1px; }
    .border-t { border-top-width: 1px; }
    .border-yellow-300 { border-color: #fde047; }
    .border-yellow-400 { border-color: #facc15; }
    .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .py-2\.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .p-1 { padding: 0.25rem; }
    .p-3 { padding: 0.75rem; }
    .p-4 { padding: 1rem; }
    .fixed { position: fixed; }
    .absolute { position: absolute; }
    .inset-0 { top: 0px; right: 0px; bottom: 0px; left: 0px; }
    .bottom-4 { bottom: 1rem; }
    .right-4 { right: 1rem; }
    .resize-none { resize: none; }
    .outline-none { outline: 2px solid transparent; outline-offset: 2px; }
    .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
    .cursor-grab { cursor: grab; }
    .cursor-grabbing { cursor: grabbing; }
    .cursor-default { cursor: default; }
    .active\\:cursor-grabbing:active { cursor: grabbing; }
    .pointer-events-none { pointer-events: none; }
    .pointer-events-auto { pointer-events: auto; }
    .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .opacity-90 { opacity: 0.9; }
    .placeholder-gray-500::placeholder { color: #6b7280; }
    
    /* Animation utilities */
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    #contextual-notes-root { all: initial; }
    #contextual-notes-root * { box-sizing: border-box; }
  `;
}
