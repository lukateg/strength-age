import styles from "@/styles/GeneratingLoader.module.css";
import { X } from "lucide-react";

export default function GeneratingLoader({ message }: { message?: string }) {
  return (
    <div className="border border-neutral-700 bg-primary-foreground font-mono text-base p-4 w-80 shadow-lg rounded-t-lg relative overflow-hidden box-border">
      <div className="absolute top-0 left-0 right-0 h-10 bg-gray-700 rounded-t px-1.5 flex items-center justify-between">
        <div className="text-neutral-200 leading-6 px-2">Teach.me</div>
        <div className="flex">
          <div className="w-4 h-4 rounded-full bg-neutral-200 ml-1.5"></div>
          <div className="w-4 h-4 rounded-full bg-transparent border border-neutral-200 ml-1.5"></div>
          <div className="w-4 h-4 rounded-full ml-1.5 flex items-center justify-center border border-neutral-200">
            <X className="w-4 h-4 text-neutral-200" />
          </div>
        </div>
      </div>
      <div className="h-16">
        <div className={`${styles.text} text-primary mt-8`}>
          {message ?? "Loading..."}
        </div>
      </div>
    </div>
  );
}
