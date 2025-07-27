"use client";

import Image from "next/image";
import type { PostType } from "@/shared/types/post.type";
import { Dialog, DialogContent } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ChevronUp } from "lucide-react";

const posts = [1, 2, 3];

export function PostModal({
  post,
  open,
  onOpenChange,
}: {
  post: PostType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[1000px]">
        <div className="flex w-full h-[500px] gap-x-10 p-2">
          <div className="w-[450px] bg-white p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/placeholder-avatar.png"
                alt="Avatar"
                width={50}
                height={50}
                className="rounded-full border"
              />
              <div>
                <p className="font-semibold">@{post.user.username}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <div className="overflow-y-auto h-[300px]">
              <p className="text-gray-700 whitespace-pre-line">{post.text}</p>
            </div>
          </div>

          <div className="w-[550px] max-w-[650px] bg-white p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Comments</h3>
              </div>
              <div
                className="space-y-3 text-sm text-gray-800 shadow-inner rounded-md p-3 bg-gray-50 h-80 overflow-y-auto"
                style={{ scrollbarGutter: "stable" }}
              >
                {posts.map((post) => {
                  return (
                    <div
                      key={post}
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
                          <h2>@Kaas</h2>
                          <p>12.10.19</p>
                        </div>
                        <p>Неймовірно!</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 w-118">
              <Textarea
                placeholder="Type your comment"
                className=" h-10 resize-none overflow-y-auto"
              />
              <Button
                type="submit"
                className="w-6 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                title="Send"
                aria-label="Send comment"
              >
                <ChevronUp className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
