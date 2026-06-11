// HR: Team, roles, payroll, org chart

export type EmploymentStatus = 'active' | 'on_leave' | 'terminated';
export type PayFrequency = 'weekly' | 'bi_weekly' | 'monthly';

export interface TeamMember {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  roleId: string;
  salary?: number;
  hireDate: Date;
  birthDate?: Date;
  status: EmploymentStatus;
  department?: string;
  manager?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  permissions: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
  createdAt: Date;
}

export interface Payroll {
  id: string;
  organizationId: string;
  memberId: string;
  period: string; // YYYY-MM
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netPay: number;
  status: 'pending' | 'processed' | 'paid';
  paidAt?: Date;
}

export interface Schedule {
  id: string;
  memberId: string;
  startDate: Date;
  endDate: Date;
  hours: number;
  type: 'regular' | 'overtime' | 'on_leave';
}

export interface OrgChart {
  id: string;
  organizationId: string;
  structure: {
    [memberId: string]: {
      name: string;
      position: string;
      reports: string[]; // member IDs of direct reports
    };
  };
  updatedAt: Date;
}