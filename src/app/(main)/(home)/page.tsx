import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold mb-4">Welcome to VibePosts</h1>
      <p className="text-muted-foreground mb-8">
        Share your thoughts, explore others, feel the vibe.
      </p>
      <Link href="/posts">
        <Button>Browse Posts</Button>
      </Link>
    </div>
  );
}
