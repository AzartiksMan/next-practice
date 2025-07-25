"use client";
import type { UserData } from "@/shared/types/userData.type";
import { useState } from "react";

export default function LoginForm({
  onSuccess,
  onBack,
}: {
  onSuccess: (user: UserData) => void;
  onBack: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login error");
      } else {
        onSuccess({ id: data.id, username: data.username });
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 p-4 border rounded w-80"
    >
      <input
        className="border rounded px-3 py-2"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        className="border rounded px-3 py-2"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className="flex gap-2">
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded disabled:bg-gray-300"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-700 px-3 py-2 rounded"
          onClick={onBack}
          disabled={loading}
        >
          Назад
        </button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
}
