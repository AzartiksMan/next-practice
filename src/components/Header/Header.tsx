"use client";

import { PAGES } from "@/app/config/pages.config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const currentUser = session?.user?.username;

  const linkClass = (href: string) =>
    `px-3 py-2 rounded-md transition-colors duration-200
    ${
      pathname === href
        ? "bg-blue-600 text-white shadow"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
    }`;

  return (
    <header className="flex border-b border-gray-200 h-14 px-8 bg-white justify-between">
      <div className="flex items-center gap-x-4">
        <Link className={linkClass(PAGES.HOME)} href={PAGES.HOME}>
          Home
        </Link>
        <Link className={linkClass(PAGES.ABOUT)} href={PAGES.ABOUT}>
          About
        </Link>
      </div>
      {currentUser && (
        <div className="flex items-center gap-4">
          <Link
            className={linkClass(PAGES.USER(currentUser))}
            href={PAGES.USER(currentUser)}
          >
            Logged in as <b>{currentUser}</b>
          </Link>
          <Button
            type="button"
            onClick={() => signOut({ callbackUrl: "/auth" })}
          >
            Log out
          </Button>
        </div>
      )}
    </header>
  );
}
