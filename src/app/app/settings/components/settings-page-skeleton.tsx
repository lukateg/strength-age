import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-[36px] w-[200px]" />
        <Skeleton className="h-[24px] w-[400px] mt-2" />
      </div>

      <Skeleton className="h-[404px] w-full" />
    </div>
  );
}
