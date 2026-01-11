// Background Service Worker for Manifest V3

import { fetchNotes, createNote, updateNote, deleteNote, CreateNoteDto, UpdateNoteDto } from './api';

console.log('Contextual Web Notes: Background service worker loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);

  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.local.set({
      notesEnabled: true,
    });
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  // Handle async responses with promises
  if (message.type === 'FETCH_NOTES') {
    const url = message.url || sender.tab?.url;
    if (!url) {
      sendResponse({ error: 'URL is required' });
      return false;
    }

    fetchNotes(url)
      .then((notes) => {
        sendResponse({ success: true, notes });
      })
      .catch((error) => {
        sendResponse({ error: error.message });
      });

    return true; // Indicates we will send a response asynchronously
  }

  if (message.type === 'CREATE_NOTE') {
    const { url, content, x, y } = message;
    if (!url) {
      sendResponse({ error: 'URL is required' });
      return false;
    }

    const noteData: CreateNoteDto = {
      url,
      content: content || '',
      x: x || 0,
      y: y || 0,
    };

    createNote(noteData)
      .then((note) => {
        sendResponse({ success: true, note });
      })
      .catch((error) => {
        sendResponse({ error: error.message });
      });

    return true;
  }

  if (message.type === 'UPDATE_NOTE') {
    const { id, content, x, y } = message;
    if (!id) {
      sendResponse({ error: 'Note ID is required' });
      return false;
    }

    const updateData: UpdateNoteDto = {};
    // Always include content if it's provided (even if empty string)
    // This ensures content updates are saved properly
    if ('content' in message) {
      updateData.content = content ?? '';
    }
    if ('x' in message && x !== undefined) updateData.x = x;
    if ('y' in message && y !== undefined) updateData.y = y;

    console.log('[Service Worker] Updating note:', id, updateData);

    updateNote(id, updateData)
      .then((note) => {
        console.log('[Service Worker] Note updated successfully:', note);
        sendResponse({ success: true, note });
      })
      .catch((error) => {
        console.error('[Service Worker] Error updating note:', error);
        sendResponse({ error: error.message });
      });

    return true;
  }

  if (message.type === 'DELETE_NOTE') {
    const { id } = message;
    if (!id) {
      sendResponse({ error: 'Note ID is required' });
      return false;
    }

    deleteNote(id)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        sendResponse({ error: error.message });
      });

    return true;
  }

  // Legacy message handlers
  if (message.type === 'GET_URL') {
    sendResponse({ url: sender.tab?.url });
    return false;
  }

  return false;
});
