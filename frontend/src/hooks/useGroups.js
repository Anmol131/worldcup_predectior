import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { groupsAPI } from '../services/api';

function formatGroupPosition(position) {
  if (position === 'first') return '1st';
  if (position === 'second') return '2nd';
  if (position === 'third') return '3rd';
  return position;
}

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
    onMutate: async ({ groupId, teamCode, position }) => {
      await queryClient.cancelQueries({ queryKey: ['groups', sessionId] });
      await queryClient.cancelQueries({ queryKey: ['session', sessionId] });

      const previousGroups = queryClient.getQueryData(['groups', sessionId]);
      const previousSession = queryClient.getQueryData(['session', sessionId]);

      if (previousGroups) {
        const normalizedPosition = formatGroupPosition(position);
        const nextGroups = {
          ...previousGroups,
          groups: previousGroups.groups.map((group) => {
            if (group.groupId !== groupId) {
              return group;
            }

            const teams = group.teams.map((team) => {
              if (team.position === normalizedPosition && team.code !== teamCode) {
                return { ...team, position: null };
              }
              if (team.code === teamCode) {
                const newPos = team.position === normalizedPosition ? null : normalizedPosition;
                return { ...team, position: newPos };
              }
              return team;
            });

            return {
              ...group,
              teams,
              isComplete: teams.filter((team) => team.position).length === 3,
            };
          }),
        };

        queryClient.setQueryData(['groups', sessionId], nextGroups);
      }

      return { previousGroups, previousSession };
    },
    onError: (err, variables, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(['groups', sessionId], context.previousGroups);
      }
      if (context?.previousSession) {
        queryClient.setQueryData(['session', sessionId], context.previousSession);
      }
    },
    onSuccess: (data) => {
      if (data?.group) {
        queryClient.setQueryData(['groups', sessionId], (previousGroups) => {
          if (!previousGroups) return previousGroups;

          return {
            ...previousGroups,
            groups: previousGroups.groups.map((group) =>
              group.groupId === data.group.groupId ? data.group : group,
            ),
          };
        });
      }

      if (data?.sessionSummary) {
        queryClient.setQueryData(['session', sessionId], (previousSession) => {
          if (!previousSession) return previousSession;

          return {
            ...previousSession,
            ...data.sessionSummary,
            session: {
              ...previousSession.session,
              ...data.sessionSummary,
            },
          };
        });
      }
    },
    onSettled: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['groups', sessionId] });
      }, 500);
    },
  });

  const confirmThirdMutation = useMutation({
    mutationFn: (selectedTeamCodes) => groupsAPI.confirmBestThird(sessionId, selectedTeamCodes),
    onSuccess: (data, selectedTeamCodes) => {
      const currentGroups = queryClient.getQueryData(['groups', sessionId]);
      const snapshot = {
        groups: currentGroups?.groups || [],
        bestThirdTeams: selectedTeamCodes,
        confirmedAt: Date.now(),
      };
      localStorage.setItem('wc2026-groups-confirmed', JSON.stringify(snapshot));

      if (data?.session) {
        queryClient.setQueryData(['session', sessionId], (previousSession) => {
          if (!previousSession) return previousSession;

          return {
            ...previousSession,
            ...data.session,
            session: data.session,
          };
        });
      }
    },
  });

  const resetBestThirdMutation = useMutation({
    mutationFn: () => groupsAPI.resetBestThird(sessionId),
    onSuccess: (data) => {
      localStorage.removeItem('wc2026-groups-confirmed');

      if (data?.session) {
        queryClient.setQueryData(['session', sessionId], (previousSession) => {
          if (!previousSession) return previousSession;

          return {
            ...previousSession,
            ...data.session,
            session: data.session,
          };
        });
      }

      queryClient.invalidateQueries({ queryKey: ['groups', sessionId] });
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
    resetBestThird: resetBestThirdMutation.mutate,
    isResetting: resetBestThirdMutation.isPending,
  };
}