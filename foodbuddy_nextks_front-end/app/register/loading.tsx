import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
      <div className="flex min-h-screen flex-col items-center justify-between p-7">
        <Skeleton className="w-[400px] h-[600px] mt-2 lg:w-[600px]" />
      </div>
    );
  }