import React, { useState, useEffect, useRef } from 'react';
import { X, GripVertical, Save, Loader2 } from 'lucide-react';

export interface NoteProps {
  id: string;
  initialPos?: { x: number; y: number };
  initialContent?: string;
  isSaving?: boolean;
  onDelete: (id: string) => void;
  onSave?: (id: string, content: string, position: { x: number; y: number }) => void;
}

const Note: React.FC<NoteProps> = ({
  id,
  initialPos = { x: 0, y: 0 },
  initialContent = '',
  isSaving = false,
  onDelete,
  onSave,
}) => {
  const [content, setContent] = useState(initialContent);
  const [position, setPosition] = useState(initialPos);
  const [isDragging, setIsDragging] = useState(false);
  const noteRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastNoteId = useRef<string>(id);
  const onSaveRef = useRef(onSave);
  const skipNextSaveRef = useRef(true); // Start with true to skip initial mount

  // Keep onSave ref updated without causing re-renders
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Sync state with props only when note ID changes (i.e., it's a different note)
  // This prevents overwriting user input when notes are refetched
  useEffect(() => {
    if (lastNoteId.current !== id) {
      // Different note - sync with props and skip the next save
      skipNextSaveRef.current = true;
      setContent(initialContent);
      setPosition(initialPos);
      lastNoteId.current = id;
    }
    // Don't sync on prop changes for the same note to preserve user input
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only depend on id, not initialContent/initialPos to avoid overwriting user input

  // Notify parent when content or position changes (parent handles debouncing)
  // Skip saves when syncing props or on initial mount to avoid unnecessary API calls
  useEffect(() => {
    // Skip save if we just synced props or on initial mount
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    // Use ref to avoid dependency on onSave function
    if (onSaveRef.current) {
      onSaveRef.current(id, content, position);
    }
  }, [content, position, id]); // Removed onSave from dependencies to prevent infinite loop

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't drag if clicking on close button or textarea
    const target = e.target as HTMLElement;
    if (target.closest('button[aria-label="Close note"]') || target.closest('textarea')) {
      return;
    }

    if (!noteRef.current) return;

    // Get the actual rendered position to calculate accurate offset
    const rect = noteRef.current.getBoundingClientRect();
    
    // Calculate offset from where user clicked relative to note's top-left corner
    // This ensures the note doesn't jump when dragging starts
    dragOffset.current = { 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    };
    
    // Update position immediately to match the rendered position (prevents jump)
    // This synchronizes the state with the actual rendered position
    if (Math.abs(rect.left - position.x) > 1 || Math.abs(rect.top - position.y) > 1) {
      setPosition({ x: rect.left, y: rect.top });
    }
    
    // Set dragging state after calculating offset to prevent jump
    setIsDragging(true);
    
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate new position based on mouse movement from initial click
      // This prevents the jump because we maintain the relative offset
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;

      // Get viewport bounds (accounting for note width = 256px = w-64)
      const maxX = Math.max(0, window.innerWidth - 256);
      const maxY = Math.max(0, window.innerHeight - 200); // Account for note height

      // Constrain to viewport
      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));

      setPosition({ x: constrainedX, y: constrainedY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // Use capture phase to ensure we catch events before other handlers
    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp, { capture: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp, { capture: true });
    };
  }, [isDragging]); // Position change will be handled by the save effect above

  return (
    <div
      ref={noteRef}
      className={`
        w-64 bg-yellow-200 rounded-md shadow-lg
        flex flex-col
        ${isDragging ? 'cursor-grabbing opacity-90' : 'cursor-default'}
        border border-yellow-300
        select-none
      `}
      style={{ 
        position: 'fixed', 
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: isDragging ? 1001 : 1000,
        userSelect: 'none',
        pointerEvents: 'auto'
      }}
    >
      {/* Header - Entire header is draggable */}
      <div 
        className="flex items-center justify-between bg-yellow-300 px-4 py-3 rounded-t-md border-b border-yellow-400 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        style={{ userSelect: 'none' }}
      >
        <div className="flex items-center gap-2 flex-1">
          <GripVertical className="w-4 h-4 text-yellow-700 pointer-events-none" />
          <span className="text-xs text-yellow-800 font-medium pointer-events-none">Note</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          className="cursor-pointer"
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: 0,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close note"
        >
          <X className="w-4 h-4 text-black pointer-events-none" />
        </button>
      </div>

      {/* Body */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your note here..."
        className="
          flex-1 p-3 bg-transparent resize-none
          text-sm text-gray-800 placeholder-gray-500
          border-none outline-none focus:outline-none
          scrollbar-thin scrollbar-thumb-yellow-400
        "
        style={{ minHeight: '150px' }}
        onMouseDown={(e) => {
          // Prevent dragging when clicking on textarea
          e.stopPropagation();
        }}
      />

      {/* Footer */}
      <div className="px-3 py-1 bg-yellow-300 rounded-b-md border-t border-yellow-400 flex items-center justify-end pointer-events-none">
        <div className="flex items-center gap-1 text-xs text-yellow-700">
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>...Saving</span>
            </>
          ) : (
            <>
              <Save className="w-3 h-3" />
              <span>Saved</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Note;
