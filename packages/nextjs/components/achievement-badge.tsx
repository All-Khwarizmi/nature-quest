import React from "react";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Achievement } from "~~/lib/types";

type AchievementBadgeProps = {
  achievement: Achievement;
} & React.HTMLAttributes<HTMLDivElement>;

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`relative aspect-square rounded-full overflow-hidden ${
              achievement.unlocked ? "" : "opacity-50 grayscale"
            }`}
          >
            <Image src={achievement.image || "/placeholder.svg"} alt={achievement.name} fill className="object-cover" />
            {!achievement.unlocked && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge variant="secondary" className="text-xs">
                  Locked
                </Badge>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{achievement.name}</p>
          <p className="text-sm text-gray-500">{achievement.description}</p>
          <p className="text-xs text-[#90EE90]">{achievement.unlocked ? "Unlocked" : "Locked"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
