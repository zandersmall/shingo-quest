import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  label: string;
  current: number;
  max: number;
  color?: "primary" | "accent" | "warning";
}

const ProgressBar = ({ label, current, max, color = "primary" }: ProgressBarProps) => {
  const percentage = (current / max) * 100;

  const colorClasses = {
    primary: "bg-primary",
    accent: "bg-accent",
    warning: "bg-warning",
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {current} / {max}
        </span>
      </div>
      <Progress value={percentage} className="h-3" />
    </div>
  );
};

export default ProgressBar;
