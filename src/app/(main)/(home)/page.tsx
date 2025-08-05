"use client";

import { PostCreationAnimation } from "@/components/animations/PostCreationAnimation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(false);

  const handleStartAnimation = () => {
    setShowAnimation(true);
  };
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold mb-4">Welcome to VibePosts</h1>
      <p className="text-muted-foreground mb-8">
        Share your thoughts, explore others, feel the vibe.
      </p>

      <div className="mb-6">
        <Button onClick={handleStartAnimation}>Запустить анимацию</Button>
      </div>
      <Link href="/posts">
        <Button>Browse Posts</Button>
      </Link>

      {showAnimation && (
        <PostCreationAnimation onComplete={() => setShowAnimation(false)} />
      )}
    </div>
  );
}
