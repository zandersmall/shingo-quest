import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getQuizById } from "@/data/quizQuestions";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useQuizScores, useUserProgress } from "@/hooks/useSupabaseData";

const QuizView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { saveScore } = useQuizScores();
  const { progress, updateProgress } = useUserProgress();
  const quiz = getQuizById(Number(id));
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit || 0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!showResults && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showResults, timeLeft]);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p>Quiz not found</p>
          <Button onClick={() => navigate("/quizzes")}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = async () => {
    if (!quiz || !user || !progress) return;
    
    const correctCount = quiz.questions.filter(
      (q, idx) => selectedAnswers[idx] === q.correctAnswer
    ).length;
    
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const isPerfect = score === 100;
    const xpEarned = isPerfect ? quiz.xpReward + quiz.bonusXp : quiz.xpReward;
    const timeTaken = (quiz.timeLimit - timeLeft);
    
    // Save to Supabase
    await saveScore(quiz.id.toString(), correctCount, quiz.questions.length, timeTaken, xpEarned);
    
    // Calculate streak
    const today = new Date().toISOString().split('T')[0];
    const lastActivityDate = progress.last_activity_date ? new Date(progress.last_activity_date).toISOString().split('T')[0] : null;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    let newStreak = progress.current_streak || 0;
    if (lastActivityDate !== today) {
      if (lastActivityDate === yesterday) {
        newStreak += 1;
      } else if (lastActivityDate === null) {
        newStreak = 1;
      } else {
        newStreak = 1;
      }
    }
    
    const newLongestStreak = Math.max(newStreak, progress.longest_streak || 0);
    
    // Update user XP and streak
    await updateProgress({
      total_xp: progress.total_xp + xpEarned,
      level: Math.floor((progress.total_xp + xpEarned) / 1000) + 1,
      current_streak: newStreak,
      longest_streak: newLongestStreak,
      last_activity_date: today
    });
    
    setShowResults(true);
    
    toast({
      title: isPerfect ? "Perfect Score! 🎉" : "Quiz Complete!",
      description: `You scored ${score}% and earned ${xpEarned} XP!`
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const correctCount = quiz.questions.filter(
      (q, idx) => selectedAnswers[idx] === q.correctAnswer
    ).length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const isPerfect = score === 100;

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-8">
            <div className="text-center space-y-6">
              <Trophy className="w-20 h-20 text-primary mx-auto" />
              <h1 className="text-4xl font-bold">Quiz Complete!</h1>
              <div className="space-y-2">
                <p className="text-6xl font-bold text-primary">{score}%</p>
                <p className="text-xl text-muted-foreground">
                  {correctCount} out of {quiz.questions.length} correct
                </p>
              </div>
              
              {isPerfect && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="font-semibold text-primary">
                    Perfect Score Bonus: +{quiz.bonusXp} XP! 🌟
                  </p>
                </div>
              )}

              <div className="space-y-4 pt-6">
                <h3 className="text-xl font-bold">Review Answers</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {quiz.questions.map((q, idx) => {
                    const isCorrect = selectedAnswers[idx] === q.correctAnswer;
                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-lg border ${
                          isCorrect
                            ? "border-primary/20 bg-primary/5"
                            : "border-destructive/20 bg-destructive/5"
                        }`}
                      >
                        <p className="font-semibold mb-2">
                          Q{idx + 1}: {q.question}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Your answer: {q.options[selectedAnswers[idx]]} {isCorrect ? "✓" : "✗"}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-muted-foreground">
                            Correct: {q.options[q.correctAnswer]}
                          </p>
                        )}
                        <p className="text-sm mt-2">{q.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-6">
                <Button onClick={() => navigate("/quizzes")}>
                  Back to Quizzes
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Retake Quiz
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const quizProgress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/quizzes")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quizzes
          </Button>
          
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <Progress value={quizProgress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>

        {/* Question Card */}
        <Card className="p-8">
          <div className="space-y-6">
            {question.image && (
              <div className="bg-muted/30 rounded-lg p-6 flex items-center justify-center">
                <img
                  src={question.image}
                  alt="Quiz"
                  className="max-w-xs max-h-48 object-contain"
                />
              </div>
            )}
            
            <h2 className="text-2xl font-bold">{question.question}</h2>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                onClick={handleFinish}
                disabled={selectedAnswers.length !== quiz.questions.length}
              >
                Finish Quiz
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === undefined}
              >
                Next
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizView;
