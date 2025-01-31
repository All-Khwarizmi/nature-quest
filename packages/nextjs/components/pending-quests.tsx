"use client";

import { useEffect, useState } from "react";
import { QuestCard } from "./quest-card";
import { Loader2 } from "lucide-react";
import { getQuests } from "~~/src/actions/questActions";
import { getUser } from "~~/src/actions/userActions";
import type { Quest, User } from "~~/src/db/schema";

interface PendingQuestsProps {
  userAddress: string;
}

export function PendingQuests({ userAddress }: PendingQuestsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [pendingQuests, setPendingQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [defaultQuest, setDefaultQuest] = useState<Quest | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser(userAddress);
        setUser(userData);

        const allQuests = await getQuests();

        if (!userData) {
          const firstQuest = allQuests.find(quest => quest.id === "8e03aa6d-baf1-413e-8243-3487c64ee95d") || null;
          setDefaultQuest(firstQuest);
          return;
        }

        const userQuestData = userData?.quests as { pending: string[]; completed: string[] };
        const userPendingQuests = allQuests.filter(quest => userQuestData.pending.includes(quest.id));
        setPendingQuests(userPendingQuests);
      } catch (error) {
        console.error("Error fetching user data or quests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userAddress]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <Loader2 className="h-6 w-6 animate-spin text-[#2C5530]" />
      </div>
    );
  }

  if (!user && defaultQuest) {    
    return <p className="text-center text-gray-500"><QuestCard
    isCompleted={false}
    key={'8e03aa6d-baf1-413e-8243-3487c64ee95d'}
    quest={defaultQuest}
    onClick={() => {
      /* TODO: Implement quest start logic */
    }}
  /></p>;
  }

  if (pendingQuests.length === 0) {
    console.log(user, 'user')
    return <p className="text-center text-gray-500">No pending quests available.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#2C5530]">Your Pending Quests</h2>
      {pendingQuests.map(quest => (
        <QuestCard
          isCompleted={false}
          key={quest.id}
          quest={quest}
          onClick={() => {
            /* TODO: Implement quest start logic */
          }}
        />
      ))}
    </div>
  );
}
