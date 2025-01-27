"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import { RewardsGrid } from "~~/components/rewards-grid";
import { Alert, AlertDescription, AlertTitle } from "~~/components/ui/alert";
import { getQuests } from "~~/src/actions/questActions";
import { getUser } from "~~/src/actions/userActions";
import type { Quest, User } from "~~/src/db/schema";

export default function RewardsPage() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<User | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;

      setIsLoading(true);
      setError(null);
      try {
        const [userData, questsData] = await Promise.all([getUser(address), getQuests()]);
        setUser(userData);
        setQuests(questsData);
      } catch (err) {
        setError("Failed to fetch rewards data. Please try again later.");
        console.error("Error fetching rewards data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchData();
    }
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2C5530] mb-6">Please connect your wallet to view your rewards</h1>
        </div>
      </main>
    );
  }

  const userQuests = user?.quests as { pending: string[]; completed: string[] };

  return (
    <main className="min-h-screen bg-white">
      <div className="container px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-[#2C5530] mb-6">Your Quests and Rewards</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#2C5530]" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : quests.length === 0 ? (
          <p className="text-center text-gray-500">No quests available at the moment. Check back later!</p>
        ) : (
          <RewardsGrid quests={quests} completedQuests={userQuests?.completed} />
        )}
      </div>
    </main>
  );
}
