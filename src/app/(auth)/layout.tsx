import { Geist } from "next/font/google";
import "../globals.css";
import { EmojiRain } from "@/components/EmojiRain";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} min-h-screen bg-gray-50 flex items-center justify-center`}
      >
        <EmojiRain />
        {children}
      </body>
    </html>
  );
}
