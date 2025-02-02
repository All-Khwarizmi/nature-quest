import { useAccount } from "wagmi";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~~/components/ui/dialog";
import { addQuestToPending } from "~~/src/actions/userActions";
import type { Quest } from "~~/src/db/schema";

interface QuestDetailsModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
}

export function QuestDetailsModal({ quest, isOpen, onClose, isCompleted }: QuestDetailsModalProps) {
  const { address } = useAccount();
  if (!quest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center pr-4">
            {quest.title}
            <Badge variant={isCompleted ? "approved" : "secondary"}>{isCompleted ? "Completed" : "Available"}</Badge>
          </DialogTitle>
          <DialogDescription>{quest.description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500 mb-2">Classification: {quest.classification}</p>
          <p className="text-sm text-gray-500 mb-2">Reward: {quest.reward} tokens</p>
          <p className="text-sm text-gray-500 mb-2">
            Progress: {quest.userCount ?? 0}/{quest.maxUsers ?? "∞"} completed
          </p>
          {quest.expiresAt && (
            <p className="text-sm text-gray-500 mb-2">Expires: {new Date(quest.expiresAt).toLocaleDateString()}</p>
          )}
        </div>
        <div className="flex justify-end mt-4 ">
          {!isCompleted && (
            <Button
              className="text-primary-content"
              onClick={async () => {
                if (address) {
                  try {
                    await addQuestToPending(address, quest);
                    console.log("Quest added successfully!");
                    onClose();
                  } catch (error) {
                    console.error("Failed to add quest:", error);
                  }
                }
              }}
            >
              Start Quest
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="ml-2">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
