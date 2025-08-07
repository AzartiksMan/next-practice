import type React from "react";
import { PostArea } from "../PostArea";
import type { TabGroup } from "@/shared/types/tabOption.type";
import { TabsSection } from "./components/TabsSection";
import { getTabs } from "@/utils/getTabs";
import { useEffect, useState } from "react";
import { usePostStore } from "@/store/postStore";

interface Props {
  tabGroup: TabGroup;
  userId?: number;
}

export const PostSection: React.FC<Props> = ({ tabGroup, userId }) => {
  const tabOptions = getTabs(tabGroup);

  const [showOnlyLiked, setShowOnlyLiked] = useState<boolean>(false);
  const resetFeed = usePostStore((state) => state.resetFeed);

  const fetchUserPosts = usePostStore((state) => state.fetchUserPosts);
  const fetchAllPosts = usePostStore((state) => state.fetchAllPosts);

  useEffect(() => {
    resetFeed();

    const fetchMode = userId
      ? () => fetchUserPosts(showOnlyLiked, userId)
      : () => fetchAllPosts(showOnlyLiked);

    fetchMode();

    return () => {
      resetFeed();
    };
  }, [showOnlyLiked, userId, fetchUserPosts, fetchAllPosts, resetFeed]);

  return (
    <div className="flex flex-col bg-white p-4 rounded-xl shadow-md gap-y-3">
      <TabsSection
        tabOptions={tabOptions}
        setShowOnlyLiked={setShowOnlyLiked}
        showOnlyLiked={showOnlyLiked}
      />

      <PostArea
        key={showOnlyLiked ? "liked" : "all"}
        userId={userId}
        showOnlyLiked={showOnlyLiked}
      />
    </div>
  );
};
