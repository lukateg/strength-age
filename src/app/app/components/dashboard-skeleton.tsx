import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="w-[394px] h-[72px]" />
        </div>
        <Skeleton className="w-[140px] h-[40px]" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="grid w-full lg:w-1/2">
            <div className="grid gap-6 md:grid-cols-2 mb-8 w-full">
              <Skeleton className="w-[234px] h-[117px]" />

              <Skeleton className="w-[234px] h-[117px]" />
            </div>
            <Skeleton className="w-[493px] h-[153px]" />
          </div>
          <div className="w-full lg:w-1/2 flex flex-row gap-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 w-full h-full">
              <Skeleton className="w-[234px] h-[302px]" />
              <Skeleton className="w-[234px] h-[302px]" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="w-[493px] h-[204px]" />
          <Skeleton className="w-[493px] h-[204px]" />
        </div>
      </div>
    </div>
  );
}
