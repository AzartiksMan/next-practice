"use client";

import { useState } from "react";
import RegisterForm from "../RegisterForm/RegisterForm";
import type { UserData } from "@/shared/types/userData.type";
import LoginForm from "../LoginForm/LoginForm";

export function AuthField({ onAuth }: { onAuth: (user: UserData) => void }) {
  const [mode, setMode] = useState<"buttons" | "register" | "login">("buttons");

  return (
    <div className="flex flex-col items-center gap-y-5">
      {mode === "buttons" && (
        <div className="flex gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>
      )}

      {mode === "login" && (
        <LoginForm
          onSuccess={(user) => {
            onAuth(user);
            setMode("buttons");
          }}
          onBack={() => setMode("buttons")}
        />
      )}

      {mode === "register" && (
        <RegisterForm
          onSuccess={(user) => {
            onAuth(user);
            setMode("buttons");
          }}
          onBack={() => setMode("buttons")}
        />
      )}
    </div>
  );
}
