// API configuration
// Note: In service workers, we can't use process.env, so use a constant
// For production, this could be stored in chrome.storage or config
const API_BASE_URL = 'http://localhost:3000';

export interface Note {
  id: string;
  url: string;
  content: string;
  x: number;
  y: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  url: string;
  content: string;
  x: number;
  y: number;
}

export interface UpdateNoteDto {
  content?: string;
  x?: number;
  y?: number;
}

// Fetch notes for a specific URL
export async function fetchNotes(url: string): Promise<Note[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/notes?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notes: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[Service Worker] Error fetching notes:', error);
    throw error;
  }
}

// Create a new note
export async function createNote(data: CreateNoteDto): Promise<Note> {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[Service Worker] Error creating note:', error);
    throw error;
  }
}

// Update an existing note
export async function updateNote(id: string, data: UpdateNoteDto): Promise<Note> {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[Service Worker] Error updating note:', error);
    throw error;
  }
}

// Delete a note
export async function deleteNote(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete note: ${response.statusText}`);
    }
  } catch (error) {
    console.error('[Service Worker] Error deleting note:', error);
    throw error;
  }
}
