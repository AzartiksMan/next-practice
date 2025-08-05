import type React from "react";
import { PostArea } from "../PostArea";
import { useEffect, useState } from "react";
import { usePostStore } from "@/store/postStore";
import type { TabGroup } from "@/shared/types/tabOption.type";
import { TabsSection } from "./components/TabsSection";
import { getTabs } from "@/utils/getTabs";

interface Props {
  tabGroup: TabGroup;
  userId?: number;
}

export const PostSection: React.FC<Props> = ({ tabGroup, userId }) => {
  const [showPostMode, setShowPostMode] = useState<boolean>(false);
  const fetchAllPosts = usePostStore((state) => state.fetchAllPosts);
  const fetchUserPosts = usePostStore((state) => state.fetchUserPosts);
  const setPosts = usePostStore((state) => state.setPosts);

  const tabOptions = getTabs(tabGroup);

  useEffect(() => {
    if (userId) {
      fetchUserPosts(showPostMode, userId);
    } else {
      fetchAllPosts(showPostMode);
    }

    return () => setPosts([]);
  }, [showPostMode, userId, fetchUserPosts, fetchAllPosts, setPosts]);

  return (
    <div className="flex flex-col bg-white p-4 rounded-xl shadow-md gap-y-3">
      <TabsSection
        mode={showPostMode}
        tabOptions={tabOptions}
        onChangeMode={setShowPostMode}
      />

      <PostArea isLikesMode={showPostMode} />
    </div>
  );
};
