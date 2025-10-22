import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoadSign } from "@/data/roadSigns";

interface SignCardProps {
  sign: RoadSign;
  onClick?: () => void;
}

const categoryColors = {
  information: "bg-primary/10 text-primary border-primary/20",
  prohibition: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  regulation: "bg-accent/10 text-accent border-accent/20",
};

const SignCard = ({ sign, onClick }: SignCardProps) => {
  return (
    <Card 
      className="group overflow-hidden hover:shadow-card-hover transition-all cursor-pointer animate-scale-in"
      onClick={onClick}
    >
      <div className="aspect-square bg-muted/30 flex items-center justify-center p-4">
        <img 
          src={sign.imagePath} 
          alt={sign.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform"
        />
      </div>
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2">{sign.name}</h3>
        <Badge variant="outline" className={categoryColors[sign.category]}>
          {sign.category}
        </Badge>
      </div>
    </Card>
  );
};

export default SignCard;
