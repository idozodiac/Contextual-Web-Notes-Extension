import { useQuery } from '@tanstack/react-query';
import { fetchNotesForUrl, NoteData } from '../utils/api';

/**
 * Hook to fetch notes for a specific URL
 */
export const useNotes = (url: string) => {
  return useQuery<NoteData[]>({
    queryKey: ['notes', url],
    queryFn: () => fetchNotesForUrl(url),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
