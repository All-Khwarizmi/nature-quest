import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Achievement } from "~~/lib/types";

interface BlockchainProofModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BlockchainProofModal({ achievement, isOpen, onClose }: BlockchainProofModalProps) {
  if (!achievement) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{achievement.name} - Blockchain Proof</DialogTitle>
          <DialogDescription>
            This achievement is securely stored on the blockchain. Here`&apos;`s the proof of your accomplishment.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500 mb-2">Transaction Hash:</p>
          <p className="font-mono text-xs bg-gray-100 p-2 rounded">{achievement.transactionHash}</p>
        </div>
        <div className="py-4">
          <p className="text-sm text-gray-500 mb-2">Smart Contract Address:</p>
          <p className="font-mono text-xs bg-gray-100 p-2 rounded">{achievement.contractAddress}</p>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
