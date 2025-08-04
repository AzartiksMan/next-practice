"use client";

import { useState } from "react";
import RegisterForm from "../RegisterForm/RegisterForm";
import { Button } from "../ui/button";
import { LoginForm } from "../LoginForm";
import Link from "next/link";
import { Home } from "lucide-react";

export function AuthField() {
  const [mode, setMode] = useState<"buttons" | "register" | "login">("buttons");

  return (
    <div className="flex flex-col items-center gap-y-5">
      {mode === "buttons" && (
        <div className="flex flex-col gap-y-6">
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
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            <Home className="w-4 h-4" />
            Return to home page
          </Link>
        </div>
      )}

      {mode === "login" && <LoginForm onBack={() => setMode("buttons")} />}

      {mode === "register" && (
        <RegisterForm onBack={() => setMode("buttons")} />
      )}
    </div>
  );
}
