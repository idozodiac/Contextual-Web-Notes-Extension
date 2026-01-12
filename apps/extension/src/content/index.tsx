import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ContentApp from './ContentApp';
import './content.css';

// Wrapper component to ensure QueryClient is created inside React context
const AppWithProviders: React.FC = () => {
  // Create QueryClient using useState with lazy initializer to ensure it's only created once
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ContentApp />
    </QueryClientProvider>
  );
};

// Create a shadow root container
const createShadowRoot = () => {
  // Check if already exists to avoid duplicates
  const existing = document.getElementById('contextual-notes-root');
  if (existing) {
    console.log('[Contextual Notes] Root already exists, removing old one');
    existing.remove();
  }

  const container = document.createElement('div');
  container.id = 'contextual-notes-root';
  document.body.appendChild(container);

  const shadowRoot = container.attachShadow({ mode: 'open' });

  // Create a mount point for React
  const mountPoint = document.createElement('div');
  mountPoint.id = 'contextual-notes-mount';
  mountPoint.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999999; pointer-events: none;';
  shadowRoot.appendChild(mountPoint);

  return { shadowRoot, mountPoint };
};

// Initialize the content script
const init = () => {
  console.log('[Contextual Notes] Content script initializing...', window.location.href);
  console.log('[Contextual Notes] Document ready state:', document.readyState);
  console.log('[Contextual Notes] Body exists:', !!document.body);
  
  // Only inject on http/https pages
  if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') {
    console.log('[Contextual Notes] Skipping non-HTTP(S) page');
    return;
  }

  // Wait for body to be available
  if (!document.body) {
    console.log('[Contextual Notes] Body not ready, waiting...');
    setTimeout(init, 100);
    return;
  }

  try {
    const { mountPoint } = createShadowRoot();
    const root = createRoot(mountPoint);
    root.render(<AppWithProviders />);
    console.log('[Contextual Notes] Content script initialized successfully!');
    console.log('[Contextual Notes] Mount point:', mountPoint);
  } catch (error) {
    console.error('[Contextual Notes] Error initializing content script:', error);
  }
};

// Run on page load - try multiple strategies
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else if (document.readyState === 'interactive' || document.readyState === 'complete') {
  // Use setTimeout to ensure DOM is fully ready
  setTimeout(init, 0);
} else {
  init();
}

// Also try after a short delay as fallback
setTimeout(() => {
  if (!document.getElementById('contextual-notes-root')) {
    console.log('[Contextual Notes] Fallback initialization');
    init();
  }
}, 1000);

// Listen for SPA navigation (for future implementation)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Re-initialize on URL change (for Phase 5)
    console.log('URL changed to:', url);
  }
}).observe(document, { subtree: true, childList: true });

