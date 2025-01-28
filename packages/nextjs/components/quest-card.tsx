import { Badge } from "~~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import type { Quest } from "~~/src/db/schema";

interface QuestCardProps {
  quest: Quest;
  isCompleted: boolean;
  onClick: () => void;
}

export function QuestCard({ quest, isCompleted, onClick }: QuestCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isCompleted ? "bg-green-50" : "hover:scale-105"
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg font-bold text-[#2C5530] truncate">{quest?.title}</span>
          <Badge variant={isCompleted ? "approved" : "secondary"}>{isCompleted ? "Completed" : "Available"}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{quest?.description}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-[#8B4513]">Reward: {quest?.reward} tokens</span>
          <span className="text-gray-500">
            {quest?.userCount ?? 0}/{quest?.maxUsers ?? "∞"} completed
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
