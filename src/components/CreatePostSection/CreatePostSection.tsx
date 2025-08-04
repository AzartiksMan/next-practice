"use client";

import { useSession } from "next-auth/react";
import { CreatePostForm } from "../CreatePostForm/CreatePostForm";
import Link from "next/link";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

export const CreatePostSection = () => {
  const { data: session, status } = useSession();
  const userId = session?.user.id;

  return (
    <div className="flex flex-col w-80 bg-white rounded-xl p-6 shadow-md self-start">
      {status === "loading" && (
        <div className="flex justify-center items-center h-20">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      )}

      {status === "authenticated" && userId && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            What&apos;s on your mind?
          </h2>
          <CreatePostForm userId={userId} />
        </>
      )}

      {status === "unauthenticated" && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Sign Up to create a post
          </h2>
          <Link href="/auth">
            <Button type="button">Start posting</Button>
          </Link>
        </>
      )}
    </div>
  );
};
