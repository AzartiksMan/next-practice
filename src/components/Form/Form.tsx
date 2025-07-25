import type { PostType } from "@/shared/types/post.type";
import { useState } from "react";

interface Props {
  loading: boolean;
  userId: number;
  error: string;
  setLoading: (value: boolean) => void;
  setError: (value: string) => void;
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
}

export const Form: React.FC<Props> = ({
  userId,
  loading,
  error,
  setLoading,
  setError,
  setPosts,
}) => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text, userId }),
      });
      if (res.status === 201) {
        const newPost: PostType = await res.json();
        setPosts((prev) => [newPost, ...prev]);
        setText("");
        setTitle("");
      } else {
        const err = await res.json();
        setError(err.error || "Error");
      }
    } catch {
      setError("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
      <h1>Create Your Post</h1>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="
            border border-gray-300 
            rounded-lg 
            px-4 py-2 
            focus:outline-none 
            focus:ring-2 focus:ring-blue-500
            transition
            "
      />
      <textarea
        placeholder="Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        rows={4}
        className="
          border border-gray-300 
          rounded-lg 
          px-4 py-2 
          focus:outline-none 
          focus:ring-2 focus:ring-blue-500
          transition
        "
      />
      <button
        type="submit"
        disabled={loading}
        className="
          px-4 py-2
          bg-blue-600
          hover:bg-blue-700
          text-white
          rounded
          font-medium
          transition
          disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed
        "
      >
        {loading ? "Saving" : "Add post"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
};
