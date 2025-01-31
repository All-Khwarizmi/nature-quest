import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export function useTokenBalance() {
  const { address } = useAccount();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [earnedTokens, setEarnedTokens] = useState<bigint>(BigInt(0));

  const { data: tokenBalance } = useScaffoldReadContract({
    contractName: "NatureToken",
    functionName: "balanceOf",
    args: [address],
  });

  const userBalanceRef = useRef<bigint | undefined>(undefined);

  useEffect(() => {
    if (tokenBalance && userBalanceRef.current !== undefined && tokenBalance > userBalanceRef.current) {
      const earned = tokenBalance - userBalanceRef.current;
      console.log("Token balance increased:", tokenBalance.toString(), "Previous:", userBalanceRef.current.toString());
      setEarnedTokens(earned);
      setShowConfetti(true);
      setShowModal(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    userBalanceRef.current = tokenBalance;
  }, [tokenBalance]);

  const closeModal = () => setShowModal(false);

  return { showConfetti, showModal, earnedTokens, tokenBalance, closeModal };
}
