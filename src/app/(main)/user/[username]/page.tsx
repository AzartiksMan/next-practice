"use client";

import { PostArea } from "@/components/PostArea";
import { Button } from "@/components/ui/button";
import type { PostType } from "@/shared/types/post.type";
import type { UserFullData } from "@/shared/types/userFullData";
import {
  statusSchema,
  type StatusFormData,
} from "@/shared/validators/statusSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState<UserFullData | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [likedPosts, setLikedPosts] = useState<PostType[]>([]);
  const [showOnlyLiked, setShowOnlyLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: session } = useSession();

  const currentUsername = session?.user?.username;

  useEffect(() => {
    setIsLoading(true);
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/byUsername/${username}`);
        const data = await res.json();
        setUser(data);
        if (data?.posts) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) fetchUser();
  }, [username]);

  const handleTogglePosts = async () => {
    setShowOnlyLiked((prev) => !prev);

    if (!likedPosts.length && user?.id) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/user/byId/${user.id}/likedPosts`);
        const data = await res.json();

        const othersLikedPosts = data.filter(
          (post: PostType) => post.user.id !== user.id
        );
        setLikedPosts(othersLikedPosts);
      } catch (err) {
        console.error("Failed to fetch liked posts:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAvatarUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fileInput = e.currentTarget.elements.namedItem(
      "avatar"
    ) as HTMLInputElement;
    if (!fileInput?.files?.[0]) return;

    if (!currentUsername) {
      console.error("Нет username");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
      const saveRes = await fetch(`/api/user/avatar/${currentUsername}`, {
        method: "PATCH",
        body: formData,
      });

      if (!saveRes.ok) throw new Error("Ошибка сохранения аватара");

      const updatedUser = await saveRes.json();
      setUser((prev) =>
        prev
          ? {
              ...prev,
              image: updatedUser.image,
              imagePublicId: updatedUser.imagePublicId,
            }
          : null
      );
    } catch (err) {
      console.error("Ошибка загрузки аватара:", err);
    }

    setPreviewUrl(null);
  };

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: user?.status || "",
    },
  });

  const handleStatusSave = async () => {
    const isValid = await form.trigger("status");
    if (!isValid) return;

    try {
      const res = await fetch(`/api/user/byUsername/${currentUsername}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: form.getValues("status"),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Server error:", err.error);
        return;
      }

      const updated = await res.json();
      setUser((prev) => prev && { ...prev, status: updated.status });
      setIsEditingStatus(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleAvatarDelete = async () => {
    if (!currentUsername) return;

    const formData = new FormData();
    formData.append("username", currentUsername);
    formData.append("delete", "true");

    try {
      const res = await fetch(`/api/user/avatar/${currentUsername}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) throw new Error("Avatar del error");

      setUser((prev) =>
        prev ? { ...prev, image: null, imagePublicId: null } : prev
      );
    } catch (err) {
      console.error("Avatar del error:", err);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }
  };
  const isCurrentUser = username === currentUsername;

  return (
    <div className="mt-16 flex justify-center gap-x-10">
      <div className="bg-white shadow-lg rounded-xl p-6 self-start ">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-1">
            {isCurrentUser && (
              <div
                className="relative w-[90px] h-[90px] cursor-pointer group overflow-hidden rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image
                  src={previewUrl || user?.image || "/placeholder-avatar.png"}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />

                <div className="absolute bottom-0 left-0 right-0 h-[26px] bg-black/40 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white/90" />
                </div>
              </div>
            )}

            {!isCurrentUser && (
              <Image
                src={user?.image || "/placeholder-avatar.png"}
                alt="Avatar"
                width={90}
                height={90}
                className="rounded-full bg-white object-cover border-2 border-gray-200 shadow-sm"
              />
            )}

            {isCurrentUser && (
              <form
                onSubmit={handleAvatarUpload}
                className="mt-1 text-center flex flex-col gap-1"
              >
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                  ref={(ref) => {
                    if (ref) fileInputRef.current = ref;
                  }}
                />

                {previewUrl && (
                  <>
                    <Button type="submit" className="text-blue-500">
                      Upload avatar
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-gray-500"
                      onClick={() => {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </form>
            )}

            {isCurrentUser && user?.image && !previewUrl && (
              <Button
                type="button"
                onClick={handleAvatarDelete}
                className="text-red-500"
              >
                Delete avatar
              </Button>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.username}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="mt-2 px-2 py-2 rounded-md bg-gray-100 text-sm text-gray-700">
          {isCurrentUser && isEditingStatus ? (
            <>
              <input
                {...form.register("status")}
                className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
                placeholder="Enter status"
              />
              <button
                type="button"
                onClick={handleStatusSave}
                className="text-xs text-green-600 hover:underline"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingStatus(false)}
                className="text-xs text-gray-500 hover:underline"
              >
                Cancel
              </button>
              {form.formState.errors.status && (
                <p className="text-xs text-red-500 ml-2">
                  {form.formState.errors.status.message}
                </p>
              )}
            </>
          ) : (
            <>
              <span>
                <span className="font-medium text-gray-600">Status:</span>{" "}
                {user?.status || "Not status yet"}
              </span>
              {isCurrentUser && (
                <button
                  type="button"
                  onClick={() => {
                    form.reset({ status: user?.status || "" });
                    setIsEditingStatus(true);
                  }}
                  className="text-xs text-blue-500 hover:underline ml-2"
                >
                  Edit
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col bg-white p-4 rounded-xl shadow-md gap-y-3">
        <div className="flex bg-gray-100 rounded-md p-1 w-full text-sm font-medium">
          <div
            onClick={() => {
              if (showOnlyLiked) handleTogglePosts();
            }}
            className={`w-1/2 py-2 px-4 cursor-pointer transition-all duration-200 ${
              !showOnlyLiked
                ? "bg-white text-black rounded-l-md shadow"
                : "text-gray-500"
            }`}
          >
            User posts
          </div>
          <div
            onClick={() => {
              if (!showOnlyLiked) handleTogglePosts();
            }}
            className={`w-1/2 py-2 px-4 cursor-pointer transition-all duration-200 ${
              showOnlyLiked
                ? "bg-white text-black rounded-r-md shadow"
                : "text-gray-500"
            }`}
          >
            Liked posts
          </div>
        </div>
        <PostArea
          setPosts={showOnlyLiked ? setLikedPosts : setPosts}
          posts={showOnlyLiked ? likedPosts : posts}
          showOnlyLiked={showOnlyLiked}
          isCurrentUser={isCurrentUser}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
