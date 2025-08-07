import { Skeleton } from "../ui/skeleton";

export const UserCardSkeleton = () => (
  <div className="p-2 border rounded shadow-sm bg-gray-50 transition h-30 flex items-center">
    <div className="flex items-center gap-x-2 w-full">
      <Skeleton className="h-[75px] w-[80px] rounded-full" />

      <div className="flex flex-col gap-y-2 w-full">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  </div>
);
