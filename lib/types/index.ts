// Export all types from central location

export type {
  GeneratorType,
  StylePreset,
  QualityLevel,
  GenerationParams,
  PresentationParams,
  EmailParams,
  LandingPageParams,
  SocialPostParams,
  AudioParams,
  PDFParams,
  GenerationResult,
  GeneratorTemplate,
} from './generators.types';

export type {
  AgentCategory,
  AgentStatus,
  Agent,
  AgentInput,
  AgentExecution,
  AgentResult,
} from './agents.types';

export type {
  PipelineStage,
  Prospect,
  ProspectNote,
  ProspectActivity,
  CRMMetrics,
} from './crm.types';

export type {
  WorkflowStatus,
  WebhookMethod,
  N8nWorkflow,
  N8nWebhook,
  WebhookExecution,
  WorkflowExecutionLog,
} from './automation.types';

export type {
  EventType,
  MetricType,
  ActivityLog,
  TimeTracking,
  Metric,
  AnalyticsDashboard,
  ExportData,
} from './analytics.types';

export type {
  CourseStatus,
  EnrollmentStatus,
  Course,
  Lesson,
  CourseEnrollment,
  Quiz,
  QuizQuestion,
  QuizResult,
  Certificate,
} from './training.types';

export type {
  EmploymentStatus,
  PayFrequency,
  TeamMember,
  Role,
  Payroll,
  Schedule,
  OrgChart,
} from './hr.types';

export type {
  ExpenseCategory,
  InvoiceStatus,
  Budget,
  Expense,
  Invoice,
  InvoiceItem,
  PandLStatement,
  CashFlow,
  FinancialReport,
} from './finance.types';

export type {
  IntegrationType,
  SyncStatus,
  Integration,
  SyncLog,
  FigmaAsset,
  AEProject,
  GoogleDriveFile,
  HubSpotContact,
} from './integrations.types';

export type {
  ApiRequest,
  ApiResponse,
  PaginatedResponse,
  ApiError,
} from './api.types';

export { ApiErrorCodes } from './api.types';
