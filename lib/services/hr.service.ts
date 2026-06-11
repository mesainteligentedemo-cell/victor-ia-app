import { db } from '@/lib/db/supabase';

export const HRService = {
  async createTeamMember(orgId: string, data: any): Promise<any> {
    const member = { id: Math.random().toString(36).substring(7), org_id: orgId, ...data };
    await db.from('team_members').insert(member);
    return member;
  },

  async updateRole(memberId: string, roleId: string): Promise<void> {
    await db.from('team_members').update({ role_id: roleId }).eq('id', memberId);
  },

  async generatePayroll(period: string): Promise<void> {
    const { data: members } = await db.from('team_members').select('id, salary');
    members?.forEach((m: any) => {
      db.from('payroll').insert({
        member_id: m.id,
        period,
        base_salary: m.salary,
        status: 'pending'
      });
    });
  },

  async getOrgChart(orgId: string): Promise<any> {
    const { data } = await db
      .from('team_members')
      .select('id, name, position, manager_id')
      .eq('org_id', orgId);
    return data;
  }
};
