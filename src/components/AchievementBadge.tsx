import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AchievementBadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  unlocked?: boolean;
}

const AchievementBadge = ({
  icon: Icon,
  title,
  description,
  unlocked = false,
}: AchievementBadgeProps) => {
  return (
    <Card
      className={`p-4 text-center transition-all duration-300 ${
        unlocked
          ? "shadow-card hover:shadow-glow bg-gradient-primary"
          : "bg-muted opacity-60"
      }`}
    >
      <div
        className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
          unlocked ? "bg-white/20 animate-pulse-glow" : "bg-background"
        }`}
      >
        <Icon className={`w-6 h-6 ${unlocked ? "text-primary-foreground" : "text-muted-foreground"}`} />
      </div>
      <h4 className={`font-semibold text-sm mb-1 ${unlocked ? "text-primary-foreground" : "text-foreground"}`}>
        {title}
      </h4>
      <p className={`text-xs ${unlocked ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {description}
      </p>
    </Card>
  );
};

export default AchievementBadge;
