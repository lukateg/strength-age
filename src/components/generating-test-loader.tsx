import styles from "@/styles/GeneratingLoader.module.css";
import { X } from "lucide-react";

export default function GeneratingLoader() {
  return (
    <div className="border border-neutral-700 bg-zinc-900 font-mono text-base p-4 w-80 shadow-lg rounded relative overflow-hidden box-border">
      <div className="absolute top-0 left-0 right-0 h-10 bg-gray-700 rounded-t px-1.5 flex items-center justify-between">
        <div className="text-neutral-200 leading-6 px-2">Teach.me</div>
        <div className="flex">
          <div className="w-4 h-4 rounded-full bg-primary ml-1.5"></div>
          <div className="w-4 h-4 rounded-full bg-transparent border border-primary ml-1.5"></div>
          <div className="w-4 h-4 rounded-full ml-1.5 flex items-center justify-center border border-primary">
            <X className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>
      <div className="h-16">
        <div className={`${styles.text} text-primary mt-8`}>
          Generating test...
        </div>
      </div>
    </div>
  );
}
