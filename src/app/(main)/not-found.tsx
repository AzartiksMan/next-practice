import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>Not Found</h1>
      <Link href={"/"}>Back to home</Link>
    </div>
  );
}
