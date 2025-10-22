import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  color?: "primary" | "accent" | "warning" | "secondary";
  onClick?: () => void;
}

const ActionCard = ({
  icon: Icon,
  title,
  description,
  buttonText,
  color = "primary",
  onClick,
}: ActionCardProps) => {
  const colorClasses = {
    primary: "bg-gradient-primary text-primary-foreground",
    accent: "bg-gradient-success text-accent-foreground",
    warning: "bg-warning text-warning-foreground",
    secondary: "bg-gradient-danger text-secondary-foreground",
  };

  return (
    <Card className="p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in">
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 text-sm">{description}</p>
      <Button 
        onClick={onClick}
        className="w-full group"
        variant={color === "primary" ? "default" : color === "accent" ? "default" : "secondary"}
      >
        {buttonText}
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </Card>
  );
};

export default ActionCard;
