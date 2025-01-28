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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser(userAddress);
        const userQuestData = userData?.quests as { pending: string[]; completed: string[] };
        setUser(userData);
        console.log(userQuestData);
        if (userData) {
          const allQuests = await getQuests();
          const userPendingQuests = allQuests.filter(quest => userQuestData.pending.includes(quest.title));
          setPendingQuests(userPendingQuests);
        }
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

  if (!user || pendingQuests.length === 0) {
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
