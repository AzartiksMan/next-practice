import type { Comment } from "@/shared/types/comment.type";
import Image from "next/image";
import type React from "react";

interface Props {
  comment: Comment;
}

export const CommentCard: React.FC<Props> = ({ comment }) => {
  return (
    <div
      key={comment.id}
      className="bg-white p-3 rounded-2xl shadow flex gap-x-5"
    >
      <Image
        src="/placeholder-avatar.png"
        alt="Avatar"
        width={50}
        height={50}
        className="rounded-full border"
      />
      <div className="w-full flex flex-col gap-y-1">
        <div className="flex justify-between">
          <h2>{comment.user.username}</h2>
          <p className="text-sm text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
        </div>
        <p>{comment.text}</p>
      </div>
    </div>
  );
};
