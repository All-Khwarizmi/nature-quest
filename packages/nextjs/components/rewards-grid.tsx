import { useState } from "react";
import { QuestCard } from "./quest-card";
import { QuestDetailsModal } from "./quest-details-modal";
import type { Quest } from "~~/src/db/schema";

interface RewardsGridProps {
  quests: Quest[];
  completedQuests: string[];
}

export function RewardsGrid({ quests, completedQuests }: RewardsGridProps) {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {quests.map(quest => (
          <QuestCard
            key={quest.id}
            quest={quest}
            isCompleted={completedQuests?.includes(quest.title)}
            onClick={() => setSelectedQuest(quest)}
          />
        ))}
      </div>
      <QuestDetailsModal
        quest={selectedQuest}
        isOpen={!!selectedQuest}
        onClose={() => setSelectedQuest(null)}
        isCompleted={selectedQuest ? completedQuests?.includes(selectedQuest.title) : false}
      />
    </>
  );
}
