import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { toast } from "sonner";
import { isAppError } from "../../convex/utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toastError = (error: unknown, message: string) => {
  let errorData = message;
  if (isAppError(error)) {
    errorData = error.data.message;
  }
  toast.error(errorData);
};
