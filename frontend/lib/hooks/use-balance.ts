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
    // Mock balance fetch for PX demo. In production, this calls the Stacks Node API.
    setTimeout(() => {
      const mockMicroStx = BigInt(5000000000); // 5000 STX
      setRawMicroStx(mockMicroStx);
      setFormattedSTX((Number(mockMicroStx) / 1000000).toLocaleString());
      setIsLoading(false);
    }, 1000);
  }, [stxAddress]);

  return { rawMicroStx, formattedSTX, isLoading };
}
