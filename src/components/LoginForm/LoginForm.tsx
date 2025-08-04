"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  type LoginFormValues,
  loginSchema,
} from "@/shared/validators/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface Props {
  onBack: () => void;
}

export const LoginForm: React.FC<Props> = ({ onBack }) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      console.log("Submitting data:", data);
      const res = await signIn("credentials", {
        redirect: false,
        ...data,
      });

      if (res?.error) {
        const message = res.error || "Login error";

        if (message.toLowerCase().includes("username")) {
          form.setError("username", { type: "manual", message });
        } else if (message.toLowerCase().includes("password")) {
          form.setError("password", { type: "manual", message });
        } else {
          form.setError("root", { type: "server", message });
        }

        return;
      }

      router.push("/");
    } catch {
      form.setError("root", { type: "server", message: "Network error" });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-80 space-y-4 border p-6 rounded-md"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pr-14"
                    placeholder="Password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={form.formState.isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-red-600 text-sm">
            {form.formState.errors.root.message}
          </p>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Logging in..." : "Login"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            disabled={form.formState.isSubmitting}
          >
            Go back
          </Button>
        </div>
      </form>
    </Form>
  );
};
