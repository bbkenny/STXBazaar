"use client";

import { useState, useEffect } from "react";
import { useStacks } from "./use-stacks";

export function useBalance() {
  const { stxAddress } = useStacks();
  const [rawMicroStx, setRawMicroStx] = useState<bigint>(BigInt(0));
  const [formattedSTX, setFormattedSTX] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stxAddress) return;
    setIsLoading(true);
    const fetchBalance = async () => {
      try {
        const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${stxAddress}/stx`);
        if (!res.ok) throw new Error("Failed to fetch balance");
        const data = await res.json();
        
        // The Hiro API returns balances as strings in microSTX (1 STX = 1,000,000 microSTX)
        const microStx = BigInt(data.balance || "0");
        setRawMicroStx(microStx);
        setFormattedSTX((Number(microStx) / 1000000).toLocaleString(undefined, { maximumFractionDigits: 6 }));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setRawMicroStx(BigInt(0));
        setFormattedSTX("0");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBalance();
  }, [stxAddress]);

  return { rawMicroStx, formattedSTX, isLoading };
}
