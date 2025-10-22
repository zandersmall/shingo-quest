import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useRoadSigns, useUserProgress } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";

const DailyChallengePlay = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { signs, loading: signsLoading } = useRoadSigns();
  const { progress, updateProgress } = useUserProgress();
  
  const [challengeSigns, setChallengeSigns] = useState<any[]>([]);
  const [allOptions, setAllOptions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (signs.length > 0 && challengeSigns.length === 0) {
      const shuffled = [...signs].sort(() => Math.random() - 0.5).slice(0, 10);
      setChallengeSigns(shuffled);
      setAllOptions(signs);
    }
  }, [signs, challengeSigns.length]);

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

  if (signsLoading || challengeSigns.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading challenge...</p>
      </div>
    );
  }

  const currentSign = challengeSigns[currentQuestion];
  
  // Generate wrong options
  const options = [
    currentSign.name,
    ...allOptions
      .filter(s => s.id !== currentSign.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(s => s.name)
  ].sort(() => Math.random() - 0.5);

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    if (answer === currentSign.name) {
      setCorrectCount(correctCount + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < challengeSigns.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    if (!user || !progress) return;
    
    const today = new Date().toISOString().split('T')[0];
    const xpEarned = correctCount >= 8 ? 150 : 100;
    
    // Save to Supabase
    await supabase.from('daily_challenge_completions').insert({
      user_id: user.id,
      challenge_date: today,
      score: correctCount,
      xp_earned: xpEarned
    });
    
    // Calculate streak
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
    
    // Update streak and XP
    await updateProgress({
      total_xp: progress.total_xp + xpEarned,
      level: Math.floor((progress.total_xp + xpEarned) / 1000) + 1,
      current_streak: newStreak,
      longest_streak: newLongestStreak,
      last_activity_date: today
    });
    
    setShowResults(true);
    
    toast({
      title: correctCount >= 8 ? "Challenge Complete! 🎉" : "Challenge Complete!",
      description: `You got ${correctCount}/10 correct and earned ${xpEarned} XP!`
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-8">
            <div className="text-center space-y-6">
              <Trophy className="w-20 h-20 text-primary mx-auto" />
              <h1 className="text-4xl font-bold">Challenge Complete!</h1>
              <div className="space-y-2">
                <p className="text-6xl font-bold text-primary">
                  {correctCount}/10
                </p>
                <p className="text-xl text-muted-foreground">
                  {correctCount >= 8 ? "Excellent work!" : "Keep practicing!"}
                </p>
              </div>
              
              {correctCount >= 8 && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="font-semibold text-primary">
                    Streak bonus earned! 🔥
                  </p>
                </div>
              )}

              <div className="flex gap-4 justify-center pt-6">
                <Button onClick={() => navigate("/daily-challenge")}>
                  Back to Challenges
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Retry Challenge
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const challengeProgress = ((currentQuestion + 1) / challengeSigns.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/daily-challenge")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Challenges
          </Button>
          
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">Daily Challenge</h1>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <Progress value={challengeProgress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Question {currentQuestion + 1} of {challengeSigns.length}
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-6 flex items-center justify-center">
              <img
                src={currentSign.image_url}
                alt="Challenge"
                className="max-w-xs max-h-48 object-contain"
              />
            </div>
            
            <h2 className="text-2xl font-bold text-center">
              What is this road sign?
            </h2>
            
            <div className="space-y-3">
              {options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentSign.name;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showFeedback}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected && showFeedback
                        ? isCorrect
                          ? "border-primary bg-primary/10"
                          : "border-destructive bg-destructive/10"
                        : isSelected
                        ? "border-primary bg-primary/5"
                        : showFeedback && isCorrect
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    } ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {option}
                    {showFeedback && isCorrect && (
                      <span className="ml-2 text-primary">✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div
                className={`p-4 rounded-lg ${
                  selectedAnswer === currentSign.name
                    ? "bg-primary/10 border border-primary/20"
                    : "bg-destructive/10 border border-destructive/20"
                }`}
              >
                <p className="font-semibold">
                  {selectedAnswer === currentSign.name
                    ? "Correct! 🎉"
                    : `Not quite. The correct answer is: ${currentSign.name}`}
                </p>
              </div>
            )}
          </div>

          {showFeedback && (
            <div className="pt-6 mt-6 border-t">
              <Button onClick={handleNext} className="w-full">
                {currentQuestion === challengeSigns.length - 1
                  ? "Finish Challenge"
                  : "Next Question"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DailyChallengePlay;
