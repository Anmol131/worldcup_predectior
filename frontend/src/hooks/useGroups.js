import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { groupsAPI } from '../services/api';
import { useToast } from '../components/ui/Toast';

function formatGroupPosition(position) {
  if (position === 'first') return '1st';
  if (position === 'second') return '2nd';
  if (position === 'third') return '3rd';
  return position;
}

export function useGroups(sessionId) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

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
      const wasComplete = previousGroups?.groups?.find((group) => group.groupId === groupId)?.isComplete;

      if (previousGroups) {
        const nextGroups = {
          ...previousGroups,
          groups: previousGroups.groups.map((group) => {
            if (group.groupId !== groupId) {
              return group;
            }

            const orderedCodes = ['1st', '2nd', '3rd']
              .map((rank) => group.teams.find((team) => team.position === rank)?.code)
              .filter(Boolean);
            const clickedIndex = orderedCodes.indexOf(teamCode);

            let nextOrder = orderedCodes;
            if (clickedIndex !== -1) {
              nextOrder = orderedCodes.filter((code) => code !== teamCode);
            } else if (orderedCodes.length < 3) {
              nextOrder = [...orderedCodes, teamCode];
            }

            const teams = group.teams.map((team) => ({ ...team, position: null }));
            nextOrder.slice(0, 3).forEach((code, index) => {
              const teamIndex = teams.findIndex((team) => team.code === code);
              if (teamIndex !== -1) {
                teams[teamIndex].position = ['1st', '2nd', '3rd'][index];
              }
            });

            return {
              ...group,
              teams,
              isComplete: nextOrder.length === 3,
            };
          }),
        };

        queryClient.setQueryData(['groups', sessionId], nextGroups);
      }

      return { previousGroups, previousSession, wasComplete };
    },
    onError: (err, variables, context) => {
      showToast('Failed to save — retrying...', 'error');
      if (context?.previousGroups) {
        queryClient.setQueryData(['groups', sessionId], context.previousGroups);
      }
      if (context?.previousSession) {
        queryClient.setQueryData(['session', sessionId], context.previousSession);
      }
    },
    onSuccess: (data, variables, context) => {
      if (data?.group) {
        queryClient.setQueryData(['groups', sessionId], (previousGroups) => {
          if (!previousGroups) return previousGroups;

          return {
            ...previousGroups,
            groups: previousGroups.groups.map((group) => (
              group.groupId === data.group.groupId ? data.group : group
            )),
          };
        });
      }

      if (data?.group?.isComplete && !context?.wasComplete) {
        showToast(`✓ Group ${variables.groupId} complete!`, 'success');
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
    onError: () => {
      showToast('Failed to save — retrying...', 'error');
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
    onError: () => {
      showToast('Failed to save — retrying...', 'error');
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