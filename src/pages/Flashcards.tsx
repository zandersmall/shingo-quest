import { CreditCard, RefreshCw, CheckCircle, XCircle, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/StatCard";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

interface DeckStats {
  total: number;
  new: number;
  learning: number;
  review: number;
}

interface Deck {
  id: number;
  title: string;
  category: string;
  stats: DeckStats;
  dueToday: number;
  color: "primary" | "accent" | "warning" | "secondary";
}

const decks: Deck[] = [
  {
    id: 1,
    title: "Information Signs",
    category: "Basic",
    stats: { total: 25, new: 3, learning: 8, review: 14 },
    dueToday: 12,
    color: "primary",
  },
  {
    id: 2,
    title: "Prohibition Signs",
    category: "Basic",
    stats: { total: 30, new: 10, learning: 12, review: 8 },
    dueToday: 15,
    color: "accent",
  },
  {
    id: 3,
    title: "Warning Signs",
    category: "Intermediate",
    stats: { total: 28, new: 15, learning: 8, review: 5 },
    dueToday: 8,
    color: "warning",
  },
  {
    id: 4,
    title: "Regulatory Signs",
    category: "Advanced",
    stats: { total: 20, new: 20, learning: 0, review: 0 },
    dueToday: 5,
    color: "secondary",
  },
];

const Flashcards = () => {
  const navigate = useNavigate();
  const totalDue = decks.reduce((sum, deck) => sum + deck.dueToday, 0);
  const totalCards = decks.reduce((sum, deck) => sum + deck.stats.total, 0);
  const totalReview = decks.reduce((sum, deck) => sum + deck.stats.review, 0);
  const totalNew = decks.reduce((sum, deck) => sum + deck.stats.new, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <header className="bg-gradient-primary text-primary-foreground py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Flashcards</h1>
          </div>
          <p className="text-primary-foreground/90 text-lg">
            Spaced repetition for better retention
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Overall Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={CreditCard}
            label="Total Cards"
            value={totalCards}
            color="primary"
          />
          <StatCard
            icon={RefreshCw}
            label="Due Today"
            value={totalDue}
            color="warning"
          />
          <StatCard
            icon={CheckCircle}
            label="Mastered"
            value={totalReview}
            color="accent"
          />
          <StatCard
            icon={Brain}
            label="New Cards"
            value={totalNew}
            color="secondary"
          />
        </section>

        {/* Study All Button */}
        {totalDue > 0 && (
          <Card className="p-6 bg-gradient-subtle">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  You have {totalDue} cards to review today
                </h3>
                <p className="text-muted-foreground">
                  Keep your streak going and master these signs!
                </p>
              </div>
              <Button size="lg" className="ml-4" onClick={() => navigate("/flashcards/review")}>
                Study All
              </Button>
            </div>
          </Card>
        )}

        {/* Decks */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Your Decks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decks.map((deck) => (
              <Card
                key={deck.id}
                className="p-6 hover:shadow-card-hover transition-all cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{deck.title}</h3>
                      <Badge variant="outline">{deck.category}</Badge>
                    </div>
                    {deck.dueToday > 0 && (
                      <Badge className="bg-warning/10 text-warning border-warning/20">
                        {deck.dueToday} due
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {deck.stats.new}
                      </div>
                      <div className="text-xs text-muted-foreground">New</div>
                    </div>
                    <div className="p-3 bg-warning/5 rounded-lg">
                      <div className="text-2xl font-bold text-warning">
                        {deck.stats.learning}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Learning
                      </div>
                    </div>
                    <div className="p-3 bg-accent/5 rounded-lg">
                      <div className="text-2xl font-bold text-accent">
                        {deck.stats.review}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Review
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={deck.dueToday > 0 ? "default" : "outline"}
                    onClick={() => navigate("/flashcards/review")}
                  >
                    {deck.dueToday > 0 ? "Study Now" : "Browse Cards"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Flashcards;
