import { BookOpen, CheckCircle, Lock, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProgressBar from "@/components/ProgressBar";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLessonProgress } from "@/hooks/useSupabaseData";

interface Lesson {
  id: number;
  title: string;
  description: string;
  signsCount: number;
  xp: number;
  locked: boolean;
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: "Basic Information Signs",
    description: "Learn essential road classification and route markers",
    signsCount: 8,
    xp: 100,
    locked: false,
  },
  {
    id: 2,
    title: "Prohibition Signs",
    description: "Master signs that restrict specific actions",
    signsCount: 12,
    xp: 150,
    locked: false,
  },
  {
    id: 3,
    title: "Warning Signs",
    description: "Recognize hazard alerts and caution indicators",
    signsCount: 15,
    xp: 200,
    locked: false,
  },
  {
    id: 4,
    title: "Regulatory Signs",
    description: "Understand mandatory actions and directions",
    signsCount: 10,
    xp: 150,
    locked: true,
  },
  {
    id: 5,
    title: "Advanced Scenarios",
    description: "Complex intersections and special conditions",
    signsCount: 20,
    xp: 300,
    locked: true,
  },
];

const Lessons = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { lessons: lessonProgressData } = useLessonProgress();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const getLessonData = (lessonId: number) => {
    const lessonProgress = lessonProgressData.find(l => l.lesson_id === lessonId.toString());
    return {
      completed: lessonProgress?.completed || false,
      progress: lessonProgress?.progress || 0
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <header className="bg-gradient-primary text-primary-foreground py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Lessons</h1>
          </div>
          <p className="text-primary-foreground/90 text-lg">
            Progressive courses from basics to advanced
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson) => {
            const data = getLessonData(lesson.id);
            return (
              <Card
                key={lesson.id}
                className="group hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-xl ${
                          data.completed
                            ? "bg-primary/10"
                            : lesson.locked
                            ? "bg-muted"
                            : "bg-accent/10"
                        }`}
                      >
                        {data.completed ? (
                          <CheckCircle className="w-6 h-6 text-primary" />
                        ) : lesson.locked ? (
                          <Lock className="w-6 h-6 text-muted-foreground" />
                        ) : (
                          <BookOpen className="w-6 h-6 text-accent" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {lesson.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {lesson.signsCount} signs
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            +{lesson.xp} XP
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {data.completed && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>

                  <p className="text-muted-foreground mb-4">{lesson.description}</p>

                  {!data.completed && data.progress > 0 && (
                    <div className="mb-4">
                      <ProgressBar
                        label=""
                        current={data.progress}
                        max={100}
                        color="primary"
                      />
                    </div>
                  )}

                  <Button
                    className="w-full"
                    disabled={lesson.locked}
                    onClick={() => navigate(`/lessons/${lesson.id}`)}
                    variant={data.completed ? "outline" : "default"}
                  >
                    {lesson.locked ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Locked
                      </>
                    ) : data.completed ? (
                      "Review Lesson"
                    ) : data.progress > 0 ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Continue
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Lesson
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Lessons;
