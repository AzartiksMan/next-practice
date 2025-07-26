"use client";

import type { UserData } from "@/shared/types/userData.type";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/shared/validators/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export default function RegisterForm({
  onSuccess,
  onBack,
}: {
  onSuccess: (user: UserData) => void;
  onBack: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.error?.includes("Username")) {
          setError("username", { type: "manual", message: result.error });
        } else if (result.error?.includes("email")) {
          setError("email", { type: "manual", message: result.error });
        } else {
          setError("root", { type: "server", message: result.error });
        }
        return;
      }

      onSuccess(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Registration error:", err.message);
      } else {
        console.error("Unknown registration error", err);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 p-4 border rounded w-80"
    >
      <div>
        <Input placeholder="Username" {...register("username")} />
        {errors.username && (
          <p className="text-red-600 text-sm">{errors.username.message}</p>
        )}
      </div>
      <div>
        <Input placeholder="Email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}
      </div>
      <div className="relative">
        <Input
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          className="pr-14"
          {...register("password")}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs h-auto px-2"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? "Hide" : "Show"}
        </Button>
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Назад
        </Button>
      </div>
    </form>
  );
}
