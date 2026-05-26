import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bracketAPI } from '../services/api';
import { useToast } from '../components/ui/Toast';

export function useBracket(sessionId) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['bracket', sessionId],
    queryFn: () => bracketAPI.getBracket(sessionId),
    enabled: !!sessionId,
  });

  const generateMutation = useMutation({
    mutationFn: () => bracketAPI.generateBracket(sessionId),
    onSuccess: () => {
      showToast('✓ Bracket generated!', 'success');
      queryClient.invalidateQueries({ queryKey: ['bracket', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
    onError: () => {
      showToast('Failed to save — retrying...', 'error');
    },
  });

  const pickWinnerMutation = useMutation({
    mutationFn: ({ round, matchId, winnerCode }) => bracketAPI.pickWinner(sessionId, round, matchId, winnerCode),
    onMutate: async ({ round, matchId, winnerCode }) => {
      await queryClient.cancelQueries({ queryKey: ['bracket', sessionId] });
      const previous = queryClient.getQueryData(['bracket', sessionId]);

      queryClient.setQueryData(['bracket', sessionId], (old) => {
        if (!old?.bracket?.rounds) {
          return old;
        }

        const updated = JSON.parse(JSON.stringify(old));
        const roundOrder = ['r32', 'r16', 'qf', 'sf', 'final'];
        const currentMatches = updated.bracket.rounds[round] || [];
        const matchIndex = currentMatches.findIndex((match) => match.matchId === matchId);
        const match = currentMatches[matchIndex];

        if (!match) {
          return old;
        }

        if (!winnerCode) {
          match.winner = null;
          return updated;
        }

        const winner = winnerCode === match.teamA.code ? match.teamA : match.teamB;
        match.winner = winner;

        const currentIdx = roundOrder.indexOf(round);
        if (currentIdx < roundOrder.length - 1) {
          const nextRound = roundOrder[currentIdx + 1];
          const nextMatchIndex = Math.floor(matchIndex / 2);
          const slot = matchIndex % 2 === 0 ? 'teamA' : 'teamB';

          if (updated.bracket.rounds[nextRound]?.[nextMatchIndex]) {
            updated.bracket.rounds[nextRound][nextMatchIndex][slot] = winner;
          }
        }

        return updated;
      });

      return { previous };
    },
    onError: (err, variables, context) => {
      showToast('Failed to save — retrying...', 'error');
      if (context?.previous) {
        queryClient.setQueryData(['bracket', sessionId], context.previous);
      }
    },
    onSettled: () => {
      window.setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['bracket', sessionId] });
      }, 800);
    },
  });

  const setChampionMutation = useMutation({
    mutationFn: (teamCode) => bracketAPI.setChampion(sessionId, teamCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bracket', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
    onError: () => {
      showToast('Failed to save — retrying...', 'error');
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