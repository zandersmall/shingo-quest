import { BookOpen, CheckCircle, Lock, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProgressBar from "@/components/ProgressBar";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { getProgress } from "@/lib/storage";
import { useEffect, useState } from "react";

interface Lesson {
  id: number;
  title: string;
  description: string;
  signsCount: number;
  xp: number;
  completed: boolean;
  locked: boolean;
  progress: number;
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: "Basic Information Signs",
    description: "Learn essential road classification and route markers",
    signsCount: 8,
    xp: 100,
    completed: true,
    locked: false,
    progress: 100,
  },
  {
    id: 2,
    title: "Prohibition Signs",
    description: "Master signs that restrict specific actions",
    signsCount: 12,
    xp: 150,
    completed: false,
    locked: false,
    progress: 60,
  },
  {
    id: 3,
    title: "Warning Signs",
    description: "Recognize hazard alerts and caution indicators",
    signsCount: 15,
    xp: 200,
    completed: false,
    locked: false,
    progress: 0,
  },
  {
    id: 4,
    title: "Regulatory Signs",
    description: "Understand mandatory actions and directions",
    signsCount: 10,
    xp: 150,
    completed: false,
    locked: true,
    progress: 0,
  },
  {
    id: 5,
    title: "Advanced Scenarios",
    description: "Complex intersections and special conditions",
    signsCount: 20,
    xp: 300,
    completed: false,
    locked: true,
    progress: 0,
  },
];

const Lessons = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    setProgress(getProgress());
  }, []);

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
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <Card
              key={lesson.id}
              className={`p-6 transition-all ${
                lesson.locked
                  ? "opacity-60"
                  : "hover:shadow-card-hover cursor-pointer"
              }`}
              onClick={() => !lesson.locked && navigate(`/lessons/${lesson.id}`)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        progress.lessonsCompleted.includes(lesson.id)
                          ? "bg-primary text-primary-foreground"
                          : lesson.locked
                          ? "bg-muted text-muted-foreground"
                          : "bg-accent text-accent-foreground"
                      }`}
                    >
                      {progress.lessonsCompleted.includes(lesson.id) ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : lesson.locked ? (
                        <Lock className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{lesson.title}</h3>
                      <p className="text-muted-foreground mb-3">
                        {lesson.description}
                      </p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <Badge variant="outline">
                          {lesson.signsCount} signs
                        </Badge>
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                          +{lesson.xp} XP
                        </Badge>
                        {progress.lessonsCompleted.includes(lesson.id) && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {!progress.lessonsCompleted.includes(lesson.id) && !lesson.locked && progress.lessonProgress[lesson.id] > 0 && (
                    <ProgressBar
                      label="Progress"
                      current={progress.lessonProgress[lesson.id]}
                      max={100}
                      color="primary"
                    />
                  )}
                </div>
                <div>
                  <Button
                    disabled={lesson.locked}
                    variant={progress.lessonsCompleted.includes(lesson.id) ? "outline" : "default"}
                    onClick={() => navigate(`/lessons/${lesson.id}`)}
                  >
                    {progress.lessonsCompleted.includes(lesson.id)
                      ? "Review"
                      : lesson.locked
                      ? "Locked"
                      : progress.lessonProgress[lesson.id] > 0
                      ? "Continue"
                      : "Start"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Lessons;
