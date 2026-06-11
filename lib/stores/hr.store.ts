import { create } from 'zustand';
import { TeamMember, OrgChart } from '@/lib/types';

interface HRState {
  teamMembers: TeamMember[];
  orgChart: OrgChart | null;
  selectedMember: TeamMember | null;
  isLoading: boolean;
  setTeamMembers: (members: TeamMember[]) => void;
  setOrgChart: (chart: OrgChart) => void;
  selectMember: (member: TeamMember | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useHRStore = create<HRState>((set) => ({
  teamMembers: [],
  orgChart: null,
  selectedMember: null,
  isLoading: false,
  setTeamMembers: (members) => set({ teamMembers: members }),
  setOrgChart: (chart) => set({ orgChart: chart }),
  selectMember: (member) => set({ selectedMember: member }),
  setLoading: (loading) => set({ isLoading: loading })
}));
