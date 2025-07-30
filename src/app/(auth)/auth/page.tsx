"use client";

import { AuthField } from "@/components/AuthField";
import { EmojiRain } from "@/components/EmojiRain";

export default function AuthPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <EmojiRain />

      <div className="relative z-10 flex flex-col items-center bg-white/80 rounded-xl shadow-xl px-8 py-10 max-w-md w-full backdrop-blur-sm">
        <div className="text-4xl font-bold mb-4 text-gray-900">
          Welcome to VibePosts!
        </div>
        <p className="mb-6 text-gray-600">Please register or login to start!</p>

        <div className="w-full">
          <AuthField />
        </div>
      </div>
    </div>
  );
}
