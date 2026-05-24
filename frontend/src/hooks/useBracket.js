import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bracketAPI } from '../services/api';

export function useBracket(sessionId) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['bracket', sessionId],
    queryFn: () => bracketAPI.getBracket(sessionId),
    enabled: !!sessionId,
  });

  const generateMutation = useMutation({
    mutationFn: () => bracketAPI.generateBracket(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bracket', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });

  const pickWinnerMutation = useMutation({
    mutationFn: ({ round, matchId, winnerCode }) => bracketAPI.pickWinner(sessionId, round, matchId, winnerCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bracket', sessionId] });
    },
  });

  const setChampionMutation = useMutation({
    mutationFn: (teamCode) => bracketAPI.setChampion(sessionId, teamCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bracket', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });

  return {
    bracket: data?.bracket || null,
    isLoading,
    error,
    generateBracket: generateMutation.mutate,
    isGenerating: generateMutation.isPending,
    pickWinner: pickWinnerMutation.mutate,
    isPicking: pickWinnerMutation.isPending,
    setChampion: setChampionMutation.mutate,
    isSettingChampion: setChampionMutation.isPending,
  };
}