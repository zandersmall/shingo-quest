import { BrainCircuit, Clock, Star, Trophy, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuizScores } from "@/hooks/useSupabaseData";

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: number;
  timeLimit: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  xpReward: number;
  bonusXp: number;
  bestScore?: number;
}

const quizzes: Quiz[] = [
  {
    id: 1,
    title: "Quick Fire - Prohibition Signs",
    description: "Identify prohibition signs under time pressure",
    questions: 10,
    timeLimit: "5 min",
    difficulty: "Easy",
    xpReward: 50,
    bonusXp: 25,
    bestScore: 90,
  },
  {
    id: 2,
    title: "Information Signs Master",
    description: "Test your knowledge of all information signs",
    questions: 15,
    timeLimit: "8 min",
    difficulty: "Medium",
    xpReward: 100,
    bonusXp: 50,
    bestScore: 73,
  },
  {
    id: 3,
    title: "Warning Signs Challenge",
    description: "Recognize warning signs and their meanings",
    questions: 20,
    timeLimit: "10 min",
    difficulty: "Medium",
    xpReward: 150,
    bonusXp: 75,
  },
  {
    id: 4,
    title: "Regulatory Signs Expert",
    description: "Advanced regulatory signs and special cases",
    questions: 25,
    timeLimit: "12 min",
    difficulty: "Hard",
    xpReward: 200,
    bonusXp: 100,
  },
  {
    id: 5,
    title: "Ultimate Sign Test",
    description: "All sign categories in one comprehensive quiz",
    questions: 50,
    timeLimit: "20 min",
    difficulty: "Expert",
    xpReward: 500,
    bonusXp: 250,
  },
];

const difficultyColors = {
  Easy: "bg-primary/10 text-primary border-primary/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Hard: "bg-destructive/10 text-destructive border-destructive/20",
  Expert: "bg-accent/10 text-accent border-accent/20",
};

const Quizzes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scores } = useQuizScores();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const getBestScore = (quizId: number) => {
    const quizScores = scores.filter(s => s.quiz_id === quizId.toString());
    return quizScores.length > 0 ? Math.max(...quizScores.map(s => s.percentage)) : null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <header className="bg-gradient-primary text-primary-foreground py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BrainCircuit className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Quizzes</h1>
          </div>
          <p className="text-primary-foreground/90 text-lg">
            Test your knowledge and earn bonus XP
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="p-6 hover:shadow-card-hover transition-all cursor-pointer space-y-4"
              onClick={() => navigate(`/quizzes/${quiz.id}`)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold flex-1">{quiz.title}</h3>
                  <Badge
                    variant="outline"
                    className={difficultyColors[quiz.difficulty]}
                  >
                    {quiz.difficulty}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{quiz.description}</p>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                  <BrainCircuit className="w-4 h-4 text-primary" />
                  <span>{quiz.questions} questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>{quiz.timeLimit}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-warning" />
                  <span>+{quiz.xpReward} XP</span>
                </div>
              </div>

              {getBestScore(quiz.id) !== null && (
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">
                    Best Score: {getBestScore(quiz.id)}%
                  </span>
                  <Star className="w-4 h-4 text-warning ml-auto" />
                </div>
              )}

              <div className="pt-2">
                <Button className="w-full" onClick={() => navigate(`/quizzes/${quiz.id}`)}>
                  {getBestScore(quiz.id) !== null ? "Retake Quiz" : "Start Quiz"}
                </Button>
                {quiz.bonusXp > 0 && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Perfect score bonus: +{quiz.bonusXp} XP
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Quizzes;
