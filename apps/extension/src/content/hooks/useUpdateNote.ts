import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNoteOnBackend, NoteData } from '../utils/api';

/**
 * Hook to update a note
 */
export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation<NoteData, Error, { id: string; data: { content?: string; x?: number; y?: number } }>({
    mutationFn: ({ id, data }) => updateNoteOnBackend(id, data),
    onSuccess: (updatedNote) => {
      // Invalidate and refetch notes for the URL of the updated note
      queryClient.invalidateQueries({ queryKey: ['notes', updatedNote.url] });
    },
    onError: (error) => {
      console.error('[useUpdateNote] Error updating note:', error);
    },
  });
};
