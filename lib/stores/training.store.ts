import { create } from 'zustand';
import { Course, CourseEnrollment, Certificate } from '@/lib/types';

interface TrainingState {
  courses: Course[];
  enrollments: CourseEnrollment[];
  certificates: Certificate[];
  isLoading: boolean;
  setCourses: (courses: Course[]) => void;
  setEnrollments: (enrollments: CourseEnrollment[]) => void;
  addCertificate: (cert: Certificate) => void;
  setLoading: (loading: boolean) => void;
}

export const useTrainingStore = create<TrainingState>((set) => ({
  courses: [],
  enrollments: [],
  certificates: [],
  isLoading: false,
  setCourses: (courses) => set({ courses }),
  setEnrollments: (enrollments) => set({ enrollments }),
  addCertificate: (cert) => set((state) => ({ certificates: [cert, ...state.certificates] })),
  setLoading: (loading) => set({ isLoading: loading })
}));
