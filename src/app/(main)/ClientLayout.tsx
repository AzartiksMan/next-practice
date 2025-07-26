"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useHasHydrated } from "@/hooks/useHasHydrated";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const hasHydrated = useHasHydrated();

  useEffect(() => {
    if (hasHydrated && !user) {
      router.replace("/auth");
    }
  }, [hasHydrated, user]);

  if (!hasHydrated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Перенаправляем...
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
