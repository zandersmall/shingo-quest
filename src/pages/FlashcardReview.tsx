import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCw, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { roadSigns } from "@/data/roadSigns";
import { updateFlashcardProgress, addXP } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";

const FlashcardReview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [cards] = useState(roadSigns);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRating = (quality: number) => {
    // quality: 0-5 (0 = forgot, 5 = perfect)
    updateFlashcardProgress(currentCard.id, quality);
    
    if (quality >= 3) {
      addXP(5); // Small XP reward for reviewing
    }

    setReviewedCount(reviewedCount + 1);

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Finished review session
      toast({
        title: "Review Complete! 🎉",
        description: `You reviewed ${cards.length} cards and earned ${cards.length * 5} XP!`
      });
      navigate("/flashcards");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/flashcards")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Flashcards
          </Button>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Flashcard Review</h1>
            <span className="text-muted-foreground">
              {currentIndex + 1} / {cards.length}
            </span>
          </div>
        </div>

        {/* Flashcard */}
        <div className="perspective-1000 mb-8">
          <Card
            className={`relative h-96 cursor-pointer transition-transform duration-500 preserve-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            onClick={handleFlip}
          >
            {/* Front */}
            <div
              className={`absolute inset-0 p-8 flex flex-col items-center justify-center backface-hidden ${
                isFlipped ? "hidden" : ""
              }`}
            >
              <div className="bg-muted/30 rounded-lg p-6 mb-4">
                <img
                  src={currentCard.imagePath}
                  alt="Road sign"
                  className="max-w-xs max-h-48 object-contain"
                />
              </div>
              <p className="text-muted-foreground text-center">
                Click to reveal the sign name
              </p>
            </div>

            {/* Back */}
            <div
              className={`absolute inset-0 p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180 ${
                !isFlipped ? "hidden" : ""
              }`}
            >
              <h2 className="text-4xl font-bold text-center mb-4">
                {currentCard.name}
              </h2>
              <p className="text-xl text-muted-foreground text-center mb-2">
                Category: {currentCard.category}
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Click to flip back
              </p>
            </div>
          </Card>
        </div>

        {/* Rating Buttons */}
        {isFlipped && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-center text-lg font-semibold">
              How well did you know this sign?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="flex flex-col h-auto py-4 border-destructive/50 hover:bg-destructive/10"
                onClick={() => handleRating(0)}
              >
                <XCircle className="w-6 h-6 mb-2 text-destructive" />
                <span className="font-semibold">Forgot</span>
                <span className="text-xs text-muted-foreground">Review soon</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-auto py-4 border-warning/50 hover:bg-warning/10"
                onClick={() => handleRating(2)}
              >
                <span className="text-2xl mb-2">😐</span>
                <span className="font-semibold">Hard</span>
                <span className="text-xs text-muted-foreground">Difficult recall</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-auto py-4 border-primary/50 hover:bg-primary/10"
                onClick={() => handleRating(4)}
              >
                <span className="text-2xl mb-2">😊</span>
                <span className="font-semibold">Good</span>
                <span className="text-xs text-muted-foreground">Correct</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-auto py-4 border-accent/50 hover:bg-accent/10"
                onClick={() => handleRating(5)}
              >
                <CheckCircle className="w-6 h-6 mb-2 text-accent" />
                <span className="font-semibold">Easy</span>
                <span className="text-xs text-muted-foreground">Perfect recall</span>
              </Button>
            </div>
          </div>
        )}

        {!isFlipped && (
          <div className="text-center">
            <Button size="lg" onClick={handleFlip}>
              <RotateCw className="w-5 h-5 mr-2" />
              Flip Card
            </Button>
          </div>
        )}
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default FlashcardReview;
