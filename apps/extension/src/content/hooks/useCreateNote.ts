import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNoteOnBackend, CreateNoteDto } from '../utils/api';

/**
 * Hook to create a new note
 */
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteDto) => createNoteOnBackend(data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch notes for the URL used in the mutation
      queryClient.invalidateQueries({ queryKey: ['notes', variables.url] });
    },
    onError: (error) => {
      console.error('[useCreateNote] Error creating note:', error);
    },
  });
};
