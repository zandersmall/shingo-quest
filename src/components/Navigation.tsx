import { Home, BookOpen, BrainCircuit, CreditCard, Calendar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/lessons", icon: BookOpen, label: "Lessons" },
  { to: "/quizzes", icon: BrainCircuit, label: "Quizzes" },
  { to: "/flashcards", icon: CreditCard, label: "Flashcards" },
  { to: "/daily-challenge", icon: Calendar, label: "Daily Challenge" },
];

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 py-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Button
                key={item.to}
                asChild
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className="whitespace-nowrap"
              >
                <Link to={item.to}>
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
