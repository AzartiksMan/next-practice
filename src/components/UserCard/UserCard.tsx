import { PAGES } from "@/app/config/pages.config";
import type { UserData } from "@/shared/types/userData.type";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

interface Props {
  userData: UserData;
  shouldExpand: boolean;
}

export const UserCard: React.FC<Props> = ({ userData, shouldExpand }) => {
  return (
    <Link
      key={userData.id}
      href={PAGES.USER(userData.username)}
      className={`p-2 border rounded shadow-sm bg-gray-50 hover:bg-gray-100 transition h-30 flex items-center ${
        shouldExpand ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-x-2">
        <Image
          src={userData?.image || "/placeholder-avatar.png"}
          alt="Avatar"
          width={80}
          height={75}
          className="rounded-full bg-white object-cover border border-gray-300 shadow"
        />

        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">
            {userData.username}
          </span>
          <span className="text-sm text-gray-500">
            {userData.status || "No status"}
          </span>
        </div>
      </div>
    </Link>
  );
};
