import { create } from 'zustand';

const useGroupIdStore = create((set) => ({
  s_groupId: null,
  s_setGroupId: (val) => set(() => ({ s_groupId: val })),
}));

const usePlayersStore = create((set) => ({
  s_players: null,
  s_setPlayers: (val) => set(() => ({ s_players: val })),
}));

export { useGroupIdStore, usePlayersStore };
