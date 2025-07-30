"use client";

import { useState } from "react";
import RegisterForm from "../RegisterForm/RegisterForm";
import LoginForm from "../LoginForm/LoginForm";
import { Button } from "../ui/button";

export function AuthField() {
  const [mode, setMode] = useState<"buttons" | "register" | "login">("buttons");

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

      {mode === "login" && <LoginForm onBack={() => setMode("buttons")} />}

      {mode === "register" && (
        <RegisterForm onBack={() => setMode("buttons")} />
      )}
    </div>
  );
}
