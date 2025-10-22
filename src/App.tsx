import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Lessons from "./pages/Lessons";
import LessonView from "./pages/LessonView";
import Quizzes from "./pages/Quizzes";
import QuizView from "./pages/QuizView";
import Flashcards from "./pages/Flashcards";
import FlashcardReview from "./pages/FlashcardReview";
import DailyChallenge from "./pages/DailyChallenge";
import DailyChallengePlay from "./pages/DailyChallengePlay";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:id" element={<LessonView />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/quizzes/:id" element={<QuizView />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/flashcards/review" element={<FlashcardReview />} />
          <Route path="/daily-challenge" element={<DailyChallenge />} />
          <Route path="/daily-challenge/play" element={<DailyChallengePlay />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
