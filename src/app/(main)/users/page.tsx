"use client";

import { PAGES } from "@/app/config/pages.config";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserData } from "@/shared/types/userData.type";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

export default function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 400);

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
    <div className="mt-16 flex flex-col justify-center items-center gap-y-10">
      <div className="flex flex-col w-160 bg-white rounded-xl p-6 shadow-md">
        <div>
          <p>Search users</p>
          <div className="relative w-full">
            <Input
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10"
            />
            {!query && (
              <Search className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
            )}
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-white p-4 rounded-xl shadow-md gap-y-3 w-160">
        <h1>Discover Community</h1>

        <div className="bg-white rounded-xl w-[610px]">
          <div
            className="shadow-inner rounded-md p-3 overflow-y-auto max-h-104 min-h-30 ring-1 ring-gray-200"
            style={{ scrollbarGutter: "stable", scrollBehavior: "smooth" }}
          >
            <div className="grid grid-cols-2 gap-4">
              {isLoading &&
                [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="p-2 border rounded shadow-sm bg-gray-50 transition h-30 flex items-center"
                  >
                    <div className="flex items-center gap-x-2 w-full">
                      <Skeleton className="h-[75px] w-[80px] rounded-full" />

                      <div className="flex flex-col gap-y-2 w-full">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                  </div>
                ))}

              {query && !isLoading && !users.length && (
                <div className="text-center text-gray-500 py-4">
                  No users found for “{query}”
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
                    <Link
                      key={user.id}
                      href={PAGES.USER(user.username)}
                      className={`p-2 border rounded shadow-sm bg-gray-50 hover:bg-gray-100 transition h-30 flex items-center ${
                        shouldExpand ? "sm:col-span-2" : ""
                      }`}
                    >
                      <div className="flex items-center gap-x-2">
                        <Image
                          src={user?.image || "/placeholder-avatar.png"}
                          alt="Avatar"
                          width={80}
                          height={75}
                          className="rounded-full bg-white object-cover border border-gray-300 shadow"
                        />

                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">
                            {user.username}
                          </span>
                          <span className="text-sm text-gray-500">
                            {user.status || "No status"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
