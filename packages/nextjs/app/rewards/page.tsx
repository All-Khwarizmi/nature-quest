import { RewardsGrid } from "~~/components/rewards-grid";
import { getUserAchievements } from "~~/lib/data";

export default async function RewardsPage() {
  const achievements = await getUserAchievements();

  return (
    <main className="min-h-screen bg-white">
      <div className="container px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-[#2C5530] mb-6">Your Achievements</h1>
        <RewardsGrid achievements={achievements} />
      </div>
    </main>
  );
}
