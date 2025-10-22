// localStorage utility for managing user progress and state

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastLoginDate: string;
  signsLearned: number;
  lessonsCompleted: number[];
  lessonProgress: Record<number, number>;
  quizScores: Record<number, number>;
  flashcardProgress: Record<string, {
    lastReview: string;
    interval: number;
    easeFactor: number;
    repetitions: number;
  }>;
  dailyChallenges: Record<string, boolean>;
  achievements: string[];
}

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastLoginDate: new Date().toISOString().split('T')[0],
  signsLearned: 0,
  lessonsCompleted: [],
  lessonProgress: {},
  quizScores: {},
  flashcardProgress: {},
  dailyChallenges: {},
  achievements: [],
};

export const getProgress = (): UserProgress => {
  const stored = localStorage.getItem('shingo-quest-progress');
  if (!stored) return DEFAULT_PROGRESS;
  
  const progress = JSON.parse(stored);
  
  // Check streak
  const today = new Date().toISOString().split('T')[0];
  const lastLogin = new Date(progress.lastLoginDate);
  const todayDate = new Date(today);
  const daysDiff = Math.floor((todayDate.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // Consecutive day, maintain streak
  } else if (daysDiff > 1) {
    // Streak broken
    progress.streak = 0;
  }
  
  progress.lastLoginDate = today;
  saveProgress(progress);
  
  return progress;
};

export const saveProgress = (progress: UserProgress): void => {
  localStorage.setItem('shingo-quest-progress', JSON.stringify(progress));
};

export const addXP = (amount: number): UserProgress => {
  const progress = getProgress();
  progress.xp += amount;
  
  // Level up logic
  const xpForNextLevel = progress.level * 400;
  if (progress.xp >= xpForNextLevel) {
    progress.level++;
  }
  
  saveProgress(progress);
  return progress;
};

export const incrementStreak = (): UserProgress => {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];
  
  if (progress.lastLoginDate !== today) {
    progress.streak++;
    progress.lastLoginDate = today;
    saveProgress(progress);
  }
  
  return progress;
};

export const completeLesson = (lessonId: number, xp: number): UserProgress => {
  const progress = getProgress();
  
  if (!progress.lessonsCompleted.includes(lessonId)) {
    progress.lessonsCompleted.push(lessonId);
    progress.lessonProgress[lessonId] = 100;
    addXP(xp);
  }
  
  saveProgress(progress);
  return progress;
};

export const updateLessonProgress = (lessonId: number, percent: number): void => {
  const progress = getProgress();
  progress.lessonProgress[lessonId] = percent;
  saveProgress(progress);
};

export const saveQuizScore = (quizId: number, score: number, xp: number): UserProgress => {
  const progress = getProgress();
  const previousBest = progress.quizScores[quizId] || 0;
  
  if (score > previousBest) {
    progress.quizScores[quizId] = score;
  }
  
  addXP(xp);
  saveProgress(progress);
  return progress;
};

export const completeDailyChallenge = (date: string, xp: number): UserProgress => {
  const progress = getProgress();
  
  if (!progress.dailyChallenges[date]) {
    progress.dailyChallenges[date] = true;
    incrementStreak();
    addXP(xp);
  }
  
  saveProgress(progress);
  return progress;
};

export const updateFlashcardProgress = (
  cardId: string,
  quality: number // 0-5 scale
): void => {
  const progress = getProgress();
  const card = progress.flashcardProgress[cardId] || {
    lastReview: new Date().toISOString(),
    interval: 1,
    easeFactor: 2.5,
    repetitions: 0,
  };
  
  // SM-2 algorithm (simplified)
  let { interval, easeFactor, repetitions } = card;
  
  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  } else {
    repetitions = 0;
    interval = 1;
  }
  
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;
  
  progress.flashcardProgress[cardId] = {
    lastReview: new Date().toISOString(),
    interval,
    easeFactor,
    repetitions,
  };
  
  saveProgress(progress);
};

export const resetProgress = (): void => {
  localStorage.removeItem('shingo-quest-progress');
};
