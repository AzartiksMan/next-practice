import type { Comment } from "@/shared/types/comment.type";
import type React from "react";
import { CommentCard } from "../CommentCard";
import { ChevronUp } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { usePostStore } from "@/store/postStore";

interface Props {
  userId?: number;
}

export const CommentSection: React.FC<Props> = ({ userId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const postInModal = usePostStore((state) => state.postInModal);
  const incrementCommentCount = usePostStore(
    (state) => state.incrementCommentCount
  );

  useEffect(() => {
    if (!postInModal?.id) {
      return;
    }
    setLoading(true);
    fetch(`/api/posts/${postInModal.id}/comments`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
      })
      .catch(() => {
        setError("Failed to load comments");
      })
      .finally(() => setLoading(false));
  }, [postInModal?.id]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !userId || !postInModal) return;

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          text: newComment,
          postId: postInModal.id,
          userId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setComments((prev) => [data, ...prev]);
      setNewComment("");
      incrementCommentCount(postInModal.id);
    } catch (err) {
      console.error("Comment send error:", err);
    }
  };

  return (
    <div className="w-[550px] max-w-[650px] bg-white p-6 rounded-2xl flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Comments</h3>
        </div>
        <div
          className="space-y-3 text-sm text-gray-800 shadow-inner rounded-md p-3 bg-gray-50 h-80 overflow-y-auto"
          style={{ scrollbarGutter: "stable", scrollBehavior: "smooth" }}
        >
          {loading && <p>Loading comments...</p>}
          {!loading && error && <p className="text-red-600 text-6xl">Error</p>}
          {!loading && !error && !comments.length && (
            <p className="text-2x1">No posts</p>
          )}
          {!loading &&
            !error &&
            !!comments.length &&
            comments.map((comment) => {
              return <CommentCard key={comment.id} comment={comment} />;
            })}
        </div>
      </div>

      <div className="flex gap-2 w-118">
        <Textarea
          placeholder="Type your comment"
          className=" h-10 resize-none overflow-y-auto"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          type="submit"
          className="w-6 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          title="Send"
          aria-label="Send comment"
          onClick={handleSubmit}
          disabled={!newComment.trim()}
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
