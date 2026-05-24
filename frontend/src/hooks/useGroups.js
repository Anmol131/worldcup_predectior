import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { groupsAPI } from '../services/api';

export function useGroups(sessionId) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['groups', sessionId],
    queryFn: () => groupsAPI.getGroups(sessionId),
    enabled: !!sessionId,
  });

  const pickMutation = useMutation({
    mutationFn: ({ groupId, teamCode, position }) =>
      groupsAPI.updateGroupPick(sessionId, groupId, teamCode, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });

  const confirmThirdMutation = useMutation({
    mutationFn: (selectedTeamCodes) => groupsAPI.confirmBestThird(sessionId, selectedTeamCodes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });

  return {
    groups: data?.groups,
    isLoading,
    error,
    pickPosition: pickMutation.mutate,
    isPicking: pickMutation.isPending,
    confirmBestThird: confirmThirdMutation.mutate,
    isConfirming: confirmThirdMutation.isPending,
  };
}