"use client";

import { PostSection } from "@/components/PostsSection";
import { TabGroup } from "@/shared/types/tabOption.type";
import type { UserFullData } from "@/shared/types/userFullData";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState<UserFullData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`/api/user/byUsername/${username}`);
        const userData = await userRes.json();
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-16 flex justify-center gap-x-10">
      <div className="bg-white shadow-lg rounded-xl p-6 self-start ">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-1">
            <Image
              src={user?.image || "/placeholder-avatar.png"}
              alt="Avatar"
              width={90}
              height={90}
              className="rounded-full bg-white object-cover border-2 border-gray-200 shadow-sm"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.username}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="mt-2 px-2 py-2 rounded-md bg-gray-100 text-sm text-gray-700">
          <span>
            <span className="font-medium text-gray-600">Status:</span>{" "}
            {user?.status || "Not status yet"}
          </span>
        </div>
      </div>

      <PostSection tabGroup={TabGroup.USER} userId={user.id} />
    </div>
  );
}
