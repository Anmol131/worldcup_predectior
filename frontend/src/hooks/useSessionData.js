import { useMutation, useQuery } from '@tanstack/react-query';
import { sessionAPI, shareAPI } from '../services/api';

export function useSessionData(sessionId) {
  const { data: session, isLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => sessionAPI.getSession(sessionId),
    enabled: !!sessionId,
  });

  return { session, isLoading };
}

export function useShare(sessionId) {
  const shareMutation = useMutation({
    mutationFn: (predictorName) => shareAPI.createShare(sessionId, predictorName),
  });

  return {
    share: shareMutation.mutate,
    shareToken: shareMutation.data?.shareToken,
    shareUrl: shareMutation.data?.shareUrl,
    isSharing: shareMutation.isPending,
    shareError: shareMutation.error,
  };
}