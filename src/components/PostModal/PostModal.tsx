"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { Session } from "next-auth";
import { CommentSection } from "../CommentSection";
import { PostPanel } from "../PostPanel";
import { usePostStore } from "@/store/postStore";

interface Props {
  session: Session | null;
}

export const PostModal: React.FC<Props> = ({ session }) => {
  const postInModal = usePostStore((state) => state.postInModal);
  const userId = session?.user.id;
  const isAdmin = session?.user?.role === "admin";
  const canEdit = isAdmin || userId === postInModal?.user.id;

  const clearPostInModal = usePostStore((state) => state.clearPostInModal);

  const onOpenChange = (open: boolean) => {
    if (!open) clearPostInModal();
  };

  return (
    <Dialog open={!!postInModal} onOpenChange={onOpenChange}>
      <DialogContent className="w-[1000px]">
        <DialogHeader>
          <DialogTitle className="sr-only">{postInModal?.title}</DialogTitle>
        </DialogHeader>
        <div className="flex w-full h-[500px] gap-x-10 p-2">
          <PostPanel canEdit={canEdit} />

          <CommentSection userId={userId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
