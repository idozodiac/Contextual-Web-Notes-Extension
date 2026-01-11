import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'Contextual Web Notes',
  version: '1.0.0',
  description: 'Attach sticky notes to specific URLs or HTML elements on any website',
  permissions: [
    'storage',
    'activeTab',
    'scripting',
  ],
  host_permissions: [
    '<all_urls>',
    'http://localhost:3000/*',
    'http://127.0.0.1:3000/*',
  ],
  background: {
    service_worker: 'src/service-worker/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['*://www.google.com/*', '*://google.com/*'],
      js: ['src/content/index.tsx'],
      run_at: 'document_end',
    },
  ],
  action: {
    default_popup: 'src/popup/index.html',
    default_title: 'Contextual Web Notes',
  },
  icons: {
    16: 'icons/icon16.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png',
  },
});

