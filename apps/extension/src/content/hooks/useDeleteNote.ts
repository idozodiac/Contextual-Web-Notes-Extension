import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNoteOnBackend } from '../utils/api';

/**
 * Hook to delete a note
 * @param currentUrl - The current URL to invalidate queries for after deletion
 */
export const useDeleteNote = (currentUrl: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNoteOnBackend(id),
    onSuccess: () => {
      // Invalidate and refetch notes for current URL
      queryClient.invalidateQueries({ queryKey: ['notes', currentUrl] });
    },
    onError: (error) => {
      console.error('[useDeleteNote] Error deleting note:', error);
    },
  });
};
