"use client";

import { CreatePostSection } from "@/components/CreatePostSection";
import { PostSection } from "@/components/PostsSection";
import { TabGroup } from "@/shared/types/tabOption.type";

export default function Posts() {
  return (
    <div className="mt-16 flex justify-center gap-x-10">
      <CreatePostSection />

      <PostSection tabGroup={TabGroup.HOME} />
    </div>
  );
}
