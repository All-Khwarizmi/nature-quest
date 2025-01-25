import { Card, CardContent, CardHeader } from "./ui/card";
import { Progress } from "./ui/progress";

interface QuestCardProps {
  title: string;
  description: string;
  progress: number;
  total: number;
  dueDate: string;
}
interface QuestCardProps {
  title: string;
  description: string;
  progress: number;
  total: number;
  dueDate: string;
}

export function QuestCard({ title, description, progress, total, dueDate }: QuestCardProps) {
  const progressPercentage = (progress / total) * 100;

  return (
    <Card className="w-full bg-card">
      <CardHeader className="pb-3">
        <h2 className="text-xl font-bold text-card-foreground">{title}</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-card-foreground font-medium">
              {progress} of {total} completed
            </span>
            <span className="text-muted-foreground">{dueDate}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
