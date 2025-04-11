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
import GeneratingLoader from "@/components/generating-test-loader";

interface LoadingContextType {
  loading: boolean;
  setLoading: (loading: boolean, message?: string) => void;
  message?: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

function LoadingOverlay() {
  const { message } = useContext(LoadingContext)!;
  return createPortal(
    <div className="fixed inset-0 z-50">
      <Card className="flex flex-col items-center justify-center h-full w-ful">
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

  return (
    <LoadingContext.Provider
      value={{ loading, setLoading: handleSetLoading, message }}
    >
      {children}
      {mounted && loading && <LoadingOverlay />}
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
