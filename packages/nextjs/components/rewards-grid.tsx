"use client";

import { useState } from "react";
import { AchievementBadge } from "./achievement-badge";
import { BlockchainProofModal } from "./blockchain-proof-modal";
import { Achievement } from "~~/lib/types";

interface RewardsGridProps {
  achievements: Achievement[];
}

export function RewardsGrid({ achievements }: RewardsGridProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {achievements.map(achievement => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            onClick={() => setSelectedAchievement(achievement)}
          />
        ))}
      </div>
      <BlockchainProofModal
        achievement={selectedAchievement}
        isOpen={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
    </>
  );
}
