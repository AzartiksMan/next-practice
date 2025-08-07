import type { UserData } from "@/shared/types/userData.type";
import type React from "react";
import { UserCardSkeleton } from "../UserCard/UserCardSkeleton";
import { UserCard } from "../UserCard/UserCard";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  debouncedQuery: string;
}

export const UserCardArea: React.FC<Props> = ({ debouncedQuery }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const url = debouncedQuery
          ? `/api/users?search=${encodeURIComponent(debouncedQuery)}`
          : "/api/users";

        const response = await fetch(url, { signal });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Unknown server error");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  return (
    <div className="flex flex-col bg-white p-4 rounded-xl shadow-md gap-y-3 w-160">
      <h1>Discover Community</h1>

      <div className="bg-white rounded-xl w-[610px]">
        <div
          className="shadow-inner rounded-md p-3 overflow-y-auto max-h-104 min-h-30 ring-1 ring-gray-200"
          style={{ scrollbarGutter: "stable", scrollBehavior: "smooth" }}
        >
          <div className="grid grid-cols-2 gap-4">
            {isLoading &&
              [...Array(6)].map((_, i) => <UserCardSkeleton key={i} />)}

            {debouncedQuery && !isLoading && !users.length && (
              <div className="text-center text-gray-500 py-4">
                No users found for “{debouncedQuery}”
              </div>
            )}

            {!isLoading &&
              !!users.length &&
              users.map((user, i) => {
                const isLast = i === users.length - 1;
                const isOdd = users.length % 2 !== 0;
                const isAlone = users.length === 1;
                const shouldExpand = (isLast && isOdd) || isAlone;

                return (
                  <UserCard
                    key={user.id}
                    userData={user}
                    shouldExpand={shouldExpand}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
