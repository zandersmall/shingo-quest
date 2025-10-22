import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLessonById, LessonSlide } from "@/data/lessonContent";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLessonProgress, useUserProgress } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";

const LessonView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { updateLesson } = useLessonProgress();
  const { progress, updateProgress } = useUserProgress();
  const lesson = getLessonById(Number(id));
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (lesson && user) {
      const slideProgress = Math.round((currentSlide / lesson.slides.length) * 100);
      updateLesson(lesson.id.toString(), { progress: slideProgress });
    }
  }, [currentSlide, lesson, user]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p>Lesson not found</p>
          <Button onClick={() => navigate("/lessons")}>Back to Lessons</Button>
        </div>
      </div>
    );
  }

  const slide = lesson.slides[currentSlide];
  const slideProgress = ((currentSlide + 1) / lesson.slides.length) * 100;

  const handleNext = async () => {
    if (slide.type === 'quiz' && selectedAnswer === null) {
      toast({
        title: "Please select an answer",
        variant: "destructive"
      });
      return;
    }

    if (slide.type === 'quiz' && !showFeedback) {
      setShowFeedback(true);
      return;
    }

    if (currentSlide < lesson.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Complete lesson in Supabase
      if (user && progress) {
        await updateLesson(lesson.id.toString(), {
          lesson_id: lesson.id.toString(),
          completed: true,
          progress: 100,
          xp_earned: lesson.xp
        });
        
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
          total_xp: progress.total_xp + lesson.xp,
          level: Math.floor((progress.total_xp + lesson.xp) / 1000) + 1,
          current_streak: newStreak,
          longest_streak: newLongestStreak,
          last_activity_date: today
        });
      }
      
      toast({
        title: "Lesson Complete! 🎉",
        description: `You earned ${lesson.xp} XP!`
      });
      navigate("/lessons");
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const renderSlideContent = (slide: LessonSlide) => {
    switch (slide.type) {
      case 'intro':
      case 'complete':
        return (
          <div className="text-center space-y-6 py-12">
            {slide.type === 'complete' && (
              <CheckCircle className="w-20 h-20 text-primary mx-auto" />
            )}
            <h2 className="text-4xl font-bold">{slide.title}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {slide.content}
            </p>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6 py-8">
            <h2 className="text-3xl font-bold">{slide.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {slide.content}
            </p>
          </div>
        );

      case 'sign':
        return (
          <div className="space-y-8 py-8">
            <div className="bg-muted/30 rounded-2xl p-8 flex items-center justify-center">
              <img
                src={slide.signImage}
                alt={slide.signName}
                className="max-w-xs max-h-64 object-contain"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-center">{slide.signName}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {slide.signMeaning}
              </p>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6 py-8">
            <h3 className="text-2xl font-bold">{slide.quizQuestion}</h3>
            <div className="space-y-3">
              {slide.quizOptions?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showFeedback && setSelectedAnswer(index)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedAnswer === index
                      ? showFeedback
                        ? index === slide.quizCorrect
                          ? "border-primary bg-primary/10"
                          : "border-destructive bg-destructive/10"
                        : "border-primary bg-primary/5"
                      : showFeedback && index === slide.quizCorrect
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  } ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {option}
                  {showFeedback && index === slide.quizCorrect && (
                    <span className="ml-2 text-primary">✓</span>
                  )}
                </button>
              ))}
            </div>
            {showFeedback && (
              <div
                className={`p-4 rounded-lg ${
                  selectedAnswer === slide.quizCorrect
                    ? "bg-primary/10 border border-primary/20"
                    : "bg-destructive/10 border border-destructive/20"
                }`}
              >
                <p className="font-semibold">
                  {selectedAnswer === slide.quizCorrect
                    ? "Correct! 🎉"
                    : "Not quite. 💭"}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/lessons")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Button>
          <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
          <Progress value={slideProgress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Slide {currentSlide + 1} of {lesson.slides.length}
          </p>
        </div>

        {/* Slide Content */}
        <Card className="p-8 min-h-[500px] flex flex-col">
          <div className="flex-1">{renderSlideContent(slide)}</div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSlide === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentSlide === lesson.slides.length - 1 ? (
                "Complete Lesson"
              ) : (
                <>
                  {slide.type === 'quiz' && !showFeedback ? "Check Answer" : "Next"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LessonView;
