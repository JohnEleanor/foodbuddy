import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-7">
      <Skeleton className="w-full h-[600vh] mt-2 " />
    </div>
  );
}