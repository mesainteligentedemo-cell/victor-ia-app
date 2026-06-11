// Training: Courses, lessons, quizzes, certificates

export type CourseStatus = 'draft' | 'published' | 'archived';
export type EnrollmentStatus = 'enrolled' | 'in_progress' | 'completed' | 'failed';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  lessons: string[]; // lesson IDs
  lessonsCount: number;
  estimatedHours: number;
  status: CourseStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
  duration: number; // minutes
  createdAt: Date;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number; // 0-100
  startedAt: Date;
  completedAt?: Date;
  score?: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // minutes
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  answers: number[];
  passed: boolean;
  submittedAt: Date;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  issuedAt: Date;
  expiresAt?: Date;
  verificationUrl: string;
}