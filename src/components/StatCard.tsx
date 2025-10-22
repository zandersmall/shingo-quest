import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: "primary" | "accent" | "warning" | "secondary";
}

const StatCard = ({ icon: Icon, label, value, color = "primary" }: StatCardProps) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    accent: "text-accent bg-accent/10",
    warning: "text-warning bg-warning/10",
    secondary: "text-secondary bg-secondary/10",
  };

  return (
    <Card className="p-4 shadow-card hover:shadow-glow transition-all duration-300 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
