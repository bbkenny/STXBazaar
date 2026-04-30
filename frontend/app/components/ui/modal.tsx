"use client";

import * as React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className = "" }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <div className={`relative z-50 w-full max-w-lg mx-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-2xl ${className}`}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--background)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors text-sm">✕</button>
        {children}
      </div>
    </div>
  );
}
