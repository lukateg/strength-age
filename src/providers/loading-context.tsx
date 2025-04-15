"use client";

import { Card } from "@/components/ui/card";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import styles from "@/styles/GeneratingLoader.module.css";

import GeneratingLoader from "@/components/generating-test-loader";

interface LoadingContextType {
  loading: boolean;
  setLoading: (loading: boolean, message?: string) => void;
  message?: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

function LoadingOverlay({ shouldDisplay }: { shouldDisplay: boolean }) {
  const { message } = useContext(LoadingContext)!;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 overlay-enter transition-all duration-1000 ${shouldDisplay ? styles["overlay-enter-active"] : styles["overlay-exit-active"]}`}
    >
      <Card className="flex flex-col items-center justify-center h-full w-full">
        <GeneratingLoader message={message} />
      </Card>
    </div>,
    document.body
  );
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [mounted, setMounted] = useState(false);

  // Only render the loading overlay after component mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSetLoading = (isLoading: boolean, loadingMessage?: string) => {
    setLoading(isLoading);
    setMessage(loadingMessage);
  };
  console.log(loading && mounted);
  return (
    <LoadingContext.Provider
      value={{ loading, setLoading: handleSetLoading, message }}
    >
      {children}
      <LoadingOverlay shouldDisplay={loading && mounted} />
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoadingContext must be used within a LoadingProvider");
  }
  return context;
}
