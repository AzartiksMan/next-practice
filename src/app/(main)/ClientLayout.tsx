"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { EmojiRain } from "@/components/EmojiRain";
import { useSession } from "next-auth/react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth");
    }
  }, [router, status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <EmojiRain />
        {status === "loading" ? "Loading session..." : "Redirecting..."}
      </div>
    );
  }

  return (
    <>
      <Header />
      <EmojiRain />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
