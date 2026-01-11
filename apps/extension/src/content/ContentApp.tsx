import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus } from 'lucide-react';
import Note from './components/Note';
import { injectStylesIntoShadow } from './utils/injectStyles';
import { 
  fetchNotesForUrl, 
  createNoteOnBackend, 
  updateNoteOnBackend, 
  deleteNoteOnBackend,
  NoteData 
} from './utils/api';

const ContentApp: React.FC = () => {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [savingNotes, setSavingNotes] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Inject Tailwind CSS into Shadow DOM
  useEffect(() => {
    const container = document.getElementById('contextual-notes-root');
    if (container?.shadowRoot) {
      injectStylesIntoShadow(container.shadowRoot);
    }
  }, []);

  // Fetch notes on page load
  useEffect(() => {
    const url = window.location.href;
    setCurrentUrl(url);

    const loadNotes = async () => {
      try {
        setIsLoading(true);
        const fetchedNotes = await fetchNotesForUrl(url);
        setNotes(fetchedNotes);
      } catch (error) {
        console.error('[Content App] Error fetching notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Reload notes when URL changes (for SPA navigation)
  useEffect(() => {
    const checkUrlChange = () => {
      const url = window.location.href;
      if (url !== currentUrl) {
        setCurrentUrl(url);
        // Reload notes for new URL
        fetchNotesForUrl(url)
          .then((fetchedNotes) => {
            setNotes(fetchedNotes);
          })
          .catch((error) => {
            console.error('[Content App] Error fetching notes for new URL:', error);
          });
      }
    };

    const interval = setInterval(checkUrlChange, 1000);
    return () => clearInterval(interval);
  }, [currentUrl]);

  const addNote = async () => {
    const tempId = `temp-${Date.now()}`;
    const x = Math.random() * 200 + 50;
    const y = Math.random() * 200 + 50;
    const newNote: NoteData = {
      id: tempId,
      url: window.location.href,
      content: '',
      x,
      y,
    };

    // Optimistically add note to UI
    setNotes((prevNotes) => [...prevNotes, newNote]);

      // Create note on backend
    try {
      const createdNote = await createNoteOnBackend({
        url: newNote.url,
        content: newNote.content,
        x: newNote.x,
        y: newNote.y,
      });

      // Replace temp note with real note from backend
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === tempId ? createdNote : note))
      );
    } catch (error) {
      console.error('[Content App] Error creating note:', error);
      // Remove the failed note
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== tempId));
    }
  };

  const deleteNote = async (id: string) => {
    // Optimistically remove from UI
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));

    // Clear any pending saves for this note
    const timeout = saveTimeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      saveTimeoutsRef.current.delete(id);
    }

    // Delete from backend
    try {
      await deleteNoteOnBackend(id);
    } catch (error) {
      console.error('[Content App] Error deleting note:', error);
      // TODO: Could add note back on error
    }
  };

  const saveNote = useCallback((id: string, content: string, position: { x: number; y: number }) => {
    console.log('[Content App] Saving note:', { id, content, position });
    
    // Update local state immediately
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, content, x: position.x, y: position.y } : note
      )
    );

    // Mark note as saving immediately when user types (or changes position)
    setSavingNotes((prev) => new Set(prev).add(id));

    // Debounce backend save (500ms delay)
    const existingTimeout = saveTimeoutsRef.current.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      // Note: We keep the saving state active since user is still typing
    }

    const timeout = setTimeout(async () => {
      try {
        console.log('[Content App] Calling updateNoteOnBackend with:', { id, content, x: position.x, y: position.y });
        const updatedNote = await updateNoteOnBackend(id, {
          content,
          x: position.x,
          y: position.y,
        });

        console.log('[Content App] Note updated successfully:', updatedNote);

        // Update note in state with saved data from backend response
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === id
              ? { ...note, content: updatedNote.content, x: updatedNote.x, y: updatedNote.y }
              : note
          )
        );

        // Mark note as saved (no longer saving)
        setSavingNotes((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } catch (error) {
        console.error('[Content App] Error saving note:', error);
        // Mark note as no longer saving even on error
        setSavingNotes((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        // TODO: Could show error to user or retry
      } finally {
        saveTimeoutsRef.current.delete(id);
      }
    }, 500);

    saveTimeoutsRef.current.set(id, timeout);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    const timeouts = saveTimeoutsRef.current;
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

  return (
    <>
      {/* Add Note Button - Floating */}
      <button
        onClick={addNote}
        className="
          fixed top-4 right-4 
          bg-blue-600 hover:bg-blue-700 
          text-white rounded-full 
          p-4 shadow-lg
          pointer-events-auto
          transition-colors
          flex items-center justify-center
        "
        style={{ zIndex: 1000000, pointerEvents: 'auto' }}
        aria-label="Add note"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Notes Container - Individual notes have pointer-events-auto */}
      {!isLoading && notes.map((note) => (
        <Note
          key={note.id}
          id={note.id}
          initialPos={{ x: note.x, y: note.y }}
          initialContent={note.content}
          isSaving={savingNotes.has(note.id)}
          onDelete={deleteNote}
          onSave={saveNote}
        />
      ))}
    </>
  );
};

export default ContentApp;
