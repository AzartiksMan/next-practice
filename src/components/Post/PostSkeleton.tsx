import { Skeleton } from "../ui/skeleton";

export const PostSkeleton = () => {
  return (
    <div className="p-4 bg-white rounded-xl shadow h-58 flex flex-col justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex gap-4">
          <Skeleton className="h-5 w-10 rounded-md" />
          <Skeleton className="h-5 w-10 rounded-md" />
        </div>
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
    </div>
  );
};
