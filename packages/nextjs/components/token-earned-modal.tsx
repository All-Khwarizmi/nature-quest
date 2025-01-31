import { Button } from "~~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~~/components/ui/dialog";

interface TokenEarnedModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnedTokens: number;
}

export function TokenEarnedModal({ isOpen, onClose, earnedTokens }: TokenEarnedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#2C5530]">Congratulations!</DialogTitle>
          <DialogDescription className="text-lg text-[#8B4513]">
            You&apos;ve earned some Nature Tokens!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 truncate">
          <p className="text-3xl font-bold text-center text-[#FFD700]">+{earnedTokens.toString()} Tokens</p>
        </div>
        <div className="flex justify-center mt-4">
          <Button onClick={onClose} className="bg-[#2C5530] text-white hover:bg-[#1A332D]">
            Awesome!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
