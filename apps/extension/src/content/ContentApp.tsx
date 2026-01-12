import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Note from './components/Note';
import { injectStylesIntoShadow } from './utils/injectStyles';
import { useNotes } from './hooks/useNotes';
import { useCreateNote } from './hooks/useCreateNote';
import { useUpdateNote } from './hooks/useUpdateNote';
import { useDeleteNote } from './hooks/useDeleteNote';
import { useDebouncedSave } from './hooks/useDebouncedSave';

const ContentApp: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<string>(window.location.href);

  // Fetch notes for current URL
  const { data: notes = [], isLoading, error } = useNotes(currentUrl);

  // Mutations
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote(currentUrl);

  // Debounced save hook
  const { saveNote, isSaving } = useDebouncedSave(updateNoteMutation);

  // Inject Tailwind CSS into Shadow DOM
  useEffect(() => {
    const container = document.getElementById('contextual-notes-root');
    if (container?.shadowRoot) {
      injectStylesIntoShadow(container.shadowRoot);
    }
  }, []);

  // Detect URL changes (for SPA navigation)
  useEffect(() => {
    const checkUrlChange = () => {
      const url = window.location.href;
      if (url !== currentUrl) {
        setCurrentUrl(url);
      }
    };

    const interval = setInterval(checkUrlChange, 1000);
    return () => clearInterval(interval);
  }, [currentUrl]);

  const addNote = () => {
    const x = Math.random() * 200 + 50;
    const y = Math.random() * 200 + 50;
    
    createNoteMutation.mutate({
      url: currentUrl,
      content: '',
      x,
      y,
    });
  };

  const deleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

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
      {!isLoading && !error && notes.map((note) => (
        <Note
          key={note.id}
          id={note.id}
          initialPos={{ x: note.x, y: note.y }}
          initialContent={note.content}
          isSaving={isSaving(note.id)}
          onDelete={deleteNote}
          onSave={saveNote}
        />
      ))}
    </>
  );
};

export default ContentApp;
