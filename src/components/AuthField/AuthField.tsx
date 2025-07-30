"use client";

import { useState } from "react";
import RegisterForm from "../RegisterForm/RegisterForm";
import type { UserData } from "@/shared/types/userData.type";
import LoginForm from "../LoginForm/LoginForm";
import { Button } from "../ui/button";

export function AuthField({ onAuth }: { onAuth: (user: UserData) => void }) {
  const [mode, setMode] = useState<"buttons" | "register" | "login">("buttons");

  const handleSuccess = (user: UserData) => {
    onAuth(user);
    setMode("buttons");
  };

  return (
    <div className="flex flex-col items-center gap-y-5">
      {mode === "buttons" && (
        <div className="flex gap-4">
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setMode("login")}
          >
            Login
          </Button>
          <Button type="button" onClick={() => setMode("register")}>
            Register
          </Button>
        </div>
      )}

      {mode === "login" && (
        <LoginForm
          onSuccess={handleSuccess}
          onBack={() => setMode("buttons")}
        />
      )}

      {mode === "register" && (
        <RegisterForm
          onSuccess={handleSuccess}
          onBack={() => setMode("buttons")}
        />
      )}
    </div>
  );
}
