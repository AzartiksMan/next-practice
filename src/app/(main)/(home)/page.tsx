"use client";

import { useEffect, useState } from "react";
import { PostArea } from "@/components/PostArea";
import { CreatePostForm } from "@/components/CreatePostForm";
import { usePostStore } from "@/store/postStore";

export default function Home() {
  const fetchAllPosts = usePostStore((state) => state.fetchAllPosts);
  const [showMostLiked, setShowMostLiked] = useState(false);

  useEffect(() => {
    fetchAllPosts(showMostLiked);
  }, [showMostLiked, fetchAllPosts]);


  const tabs = [
    { label: "Newest", value: false },
    { label: "Top liked", value: true },
  ];

  return (
    <div className="mt-16 flex justify-center gap-x-10">
      <CreatePostForm />

      <div className="flex flex-col bg-white p-4 rounded-xl shadow-md gap-y-3">
        <div className="flex bg-gray-100 rounded-md p-1 w-full text-sm font-medium">
          {tabs.map((tab, i) => (
            <div
              key={tab.label}
              onClick={() => setShowMostLiked(tab.value)}
              className={`w-1/2 py-2 px-4 cursor-pointer transition-all duration-200 ${
                showMostLiked === tab.value
                  ? "bg-white text-black shadow"
                  : "text-gray-500"
              } ${i === 0 ? "rounded-l-md" : "rounded-r-md"}`}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <PostArea />
      </div>
    </div>
  );
}
