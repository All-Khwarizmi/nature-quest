import { BackgroundPattern } from "~~/components/background-pattern";
import { PhotoCapture } from "~~/components/photo-capture";
import { QuestCard } from "~~/components/quest-card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundPattern />
      <div className="relative z-10 flex flex-col min-h-screen">
        <section className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="w-full items-center justify-center max-w-md space-y-8">
            <PhotoCapture />
            <QuestCard
              title="Spot Spring Birds"
              description="Find and photograph 3 different spring migratory birds in your area"
              progress={1}
              total={3}
              dueDate="2 days left"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
