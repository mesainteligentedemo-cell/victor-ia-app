import { db } from '@/lib/db/supabase';

export const TrainingService = {
  async enrollCourse(userId: string, courseId: string): Promise<void> {
    await db.from('course_enrollments').insert({
      user_id: userId,
      course_id: courseId,
      status: 'enrolled',
      progress: 0,
      started_at: new Date()
    });
  },

  async getProgress(userId: string, courseId: string): Promise<number> {
    const { data } = await db
      .from('course_enrollments')
      .select('progress')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();
    return data?.progress || 0;
  },

  async completeLesson(userId: string, courseId: string, lessonId: string): Promise<void> {
    await db.from('lesson_progress').insert({
      user_id: userId,
      course_id: courseId,
      lesson_id: lessonId,
      completed_at: new Date()
    });
  },

  async submitQuiz(userId: string, quizId: string, answers: number[]): Promise<number> {
    const { data: quiz } = await db
      .from('quizzes')
      .select('questions')
      .eq('id', quizId)
      .single();

    let score = 0;
    quiz.questions.forEach((q: any, i: number) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    await db.from('quiz_results').insert({
      user_id: userId,
      quiz_id: quizId,
      score: (score / quiz.questions.length) * 100,
      answers,
      submitted_at: new Date()
    });

    return score;
  },

  async generateCertificate(userId: string, courseId: string): Promise<string> {
    const certId = Math.random().toString(36).substring(7);
    await db.from('certificates').insert({
      user_id: userId,
      course_id: courseId,
      id: certId,
      issued_at: new Date()
    });
    return certId;
  }
};
