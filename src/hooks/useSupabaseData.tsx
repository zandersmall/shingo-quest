import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserProgress {
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

export interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  progress: number;
  xp_earned: number;
}

export interface QuizScore {
  quiz_id: string;
  score: number;
  percentage: number;
  completed_at: string;
}

export interface FlashcardProgress {
  deck_id: string;
  card_id: string;
  ease_factor: number;
  interval: number;
  repetitions: number;
  due_date: string;
}

export interface DailyChallengeCompletion {
  challenge_date: string;
  score: number;
  xp_earned: number;
}

export function useUserProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchProgress();
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching progress:', error);
    } else {
      setProgress(data);
    }
    setLoading(false);
  };

  const updateProgress = async (updates: Partial<UserProgress>) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_progress')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating progress:', error);
    } else {
      fetchProgress();
    }
  };

  return { progress, loading, updateProgress, refreshProgress: fetchProgress };
}

export function useLessonProgress() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchLessons();
  }, [user]);

  const fetchLessons = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching lessons:', error);
    } else {
      setLessons(data || []);
    }
    setLoading(false);
  };

  const updateLesson = async (lessonId: string, updates: Partial<LessonProgress>) => {
    if (!user) return;

    const { error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        ...updates
      });

    if (error) {
      console.error('Error updating lesson:', error);
    } else {
      fetchLessons();
    }
  };

  return { lessons, loading, updateLesson, refreshLessons: fetchLessons };
}

export function useQuizScores() {
  const { user } = useAuth();
  const [scores, setScores] = useState<QuizScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchScores();
  }, [user]);

  const fetchScores = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching scores:', error);
    } else {
      setScores(data || []);
    }
    setLoading(false);
  };

  const saveScore = async (quizId: string, score: number, totalQuestions: number, timeTaken: number, xpEarned: number) => {
    if (!user) return;

    const percentage = Math.round((score / totalQuestions) * 100);

    const { error } = await supabase
      .from('quiz_scores')
      .insert({
        user_id: user.id,
        quiz_id: quizId,
        score,
        total_questions: totalQuestions,
        percentage,
        time_taken: timeTaken,
        xp_earned: xpEarned
      });

    if (error) {
      console.error('Error saving score:', error);
    } else {
      fetchScores();
    }
  };

  return { scores, loading, saveScore, refreshScores: fetchScores };
}

export function useRoadSigns() {
  const [signs, setSigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSigns();
  }, []);

  const fetchSigns = async () => {
    const { data, error } = await supabase
      .from('road_signs')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching signs:', error);
    } else {
      setSigns(data || []);
    }
    setLoading(false);
  };

  return { signs, loading, refreshSigns: fetchSigns };
}
