"use client";

import { PAGES } from "@/app/config/pages.config";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `px-3 py-2 rounded-md transition-colors duration-200
    ${
      pathname === href
        ? "bg-blue-600 text-white shadow"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
    }`;

  return (
    <header className="flex border-b border-gray-200 gap-x-4 h-14 items-center px-8 bg-white">
      <Link className={linkClass(PAGES.HOME)} href={PAGES.HOME}>
        Home
      </Link>
      <Link className={linkClass(PAGES.ABOUT)} href={PAGES.ABOUT}>
        About
      </Link>
      <Link className={linkClass(PAGES.PROFILE)} href={PAGES.PROFILE}>
        Profile
      </Link>
    </header>
  );
}
