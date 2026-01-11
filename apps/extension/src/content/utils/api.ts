// Helper functions to communicate with service worker for API calls

export interface NoteData {
  id: string;
  url: string;
  content: string;
  x: number;
  y: number;
  createdAt?: string;
  updatedAt?: string;
  position?: { x: number; y: number }; // For backward compatibility
}

export interface CreateNoteDto {
  url: string;
  content: string;
  x: number;
  y: number;
}

// Fetch notes for current URL
export async function fetchNotesForUrl(url: string): Promise<NoteData[]> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'FETCH_NOTES', url },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (response?.error) {
          reject(new Error(response.error));
          return;
        }

        if (response?.success && response.notes) {
          // Transform backend format to component format
          const notes: NoteData[] = response.notes.map((note: any) => ({
            id: note.id,
            url: note.url,
            content: note.content,
            x: note.x,
            y: note.y,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
          }));
          resolve(notes);
        } else {
          resolve([]);
        }
      }
    );
  });
}

// Create a new note
export async function createNoteOnBackend(data: CreateNoteDto): Promise<NoteData> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'CREATE_NOTE', ...data },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (response?.error) {
          reject(new Error(response.error));
          return;
        }

        if (response?.success && response.note) {
          const note: NoteData = {
            id: response.note.id,
            url: response.note.url,
            content: response.note.content,
            x: response.note.x,
            y: response.note.y,
            createdAt: response.note.createdAt,
            updatedAt: response.note.updatedAt,
          };
          resolve(note);
        } else {
          reject(new Error('Failed to create note'));
        }
      }
    );
  });
}

// Update a note
export async function updateNoteOnBackend(
  id: string,
  data: { content?: string; x?: number; y?: number }
): Promise<NoteData> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'UPDATE_NOTE', id, ...data },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (response?.error) {
          reject(new Error(response.error));
          return;
        }

        if (response?.success && response.note) {
          const note: NoteData = {
            id: response.note.id,
            url: response.note.url,
            content: response.note.content,
            x: response.note.x,
            y: response.note.y,
            createdAt: response.note.createdAt,
            updatedAt: response.note.updatedAt,
          };
          resolve(note);
        } else {
          reject(new Error('Failed to update note'));
        }
      }
    );
  });
}

// Delete a note
export async function deleteNoteOnBackend(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'DELETE_NOTE', id },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (response?.error) {
          reject(new Error(response.error));
          return;
        }

        if (response?.success) {
          resolve();
        } else {
          reject(new Error('Failed to delete note'));
        }
      }
    );
  });
}
