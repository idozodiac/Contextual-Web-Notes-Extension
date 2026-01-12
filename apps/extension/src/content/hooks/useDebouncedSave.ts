import { useCallback, useRef, useState, useEffect } from 'react';
import { UseMutationResult } from '@tanstack/react-query';

/**
 * Hook to handle debounced saving of notes
 * Manages the saving state and debounces the mutation call
 */
export const useDebouncedSave = (
  updateMutation: UseMutationResult<any, Error, { id: string; data: { content?: string; x?: number; y?: number } }, unknown>,
  debounceMs: number = 500
) => {
  const [savingNotes, setSavingNotes] = useState<Set<string>>(new Set());
  const saveTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const saveNote = useCallback(
    (id: string, content: string, position: { x: number; y: number }) => {
      // Mark note as saving immediately when user types (or changes position)
      setSavingNotes((prev) => new Set(prev).add(id));

      // Debounce backend save
      const existingTimeout = saveTimeoutsRef.current.get(id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeout = setTimeout(() => {
        updateMutation.mutate(
          {
            id,
            data: {
              content,
              x: position.x,
              y: position.y,
            },
          },
          {
            onSettled: () => {
              // Mark note as saved (no longer saving) after mutation completes
              setSavingNotes((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
              });
              saveTimeoutsRef.current.delete(id);
            },
          }
        );
      }, debounceMs);

      saveTimeoutsRef.current.set(id, timeout);
    },
    [updateMutation, debounceMs]
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    const timeouts = saveTimeoutsRef.current;
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

  return {
    saveNote,
    savingNotes,
    isSaving: (id: string) => savingNotes.has(id),
  };
};
