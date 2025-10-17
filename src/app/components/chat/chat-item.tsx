"use client";

import { useQueryClient } from "@tanstack/react-query";
import { redirect, useParams, useRouter } from "next/navigation";
import { Member, User } from "../../../../db/schema";
import ActionTooltip from "../action-tooltip";
import { roleIconMap } from "../server-member";
import UserAvatar from "../user-avatar";
import Image from "next/image";
import { Edit, FileIcon, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import z from "zod";
import qs from "query-string";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useModal } from "../../../../hooks/use-modal-store";
import Picker, { EmojiClickData as EmojiData, Theme } from "emoji-picker-react";
import { EmojiPicker } from "../emoji-picker";

interface ChatItemProps {
  id: string;
  content: string;
  currentMember: Member;
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
  member?: Member & {
    user: User;
  };
  reactions?: string[];
  showAvatar?: boolean;
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatItem = ({
  id,
  content,
  currentMember,
  member,
  timestamp,
  fileUrl,
  deleted,
  isUpdated,
  socketUrl,
  socketQuery,
  reactions = [],
  showAvatar = true,
}: ChatItemProps) => {
  if (!member) {
    return redirect("/me");
  }

  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();
  const queryClient = useQueryClient();

  const onMemberClick = () => {
    if (member.id === currentMember.id) return;
    router.push(`/me/servers/${params?.serverId}/conversations/${member.id}`);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content },
  });

  useEffect(() => {
    form.reset({ content });
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsEditing(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fileType = fileUrl?.split(".").pop();
  const isAdmin = currentMember.role === "ADMIN";
  const isModerator = currentMember.role === "MODERATOR";
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner;
  const isLoading = form.formState.isSubmitting;
  const isPdf = fileType === "pdf" && fileUrl;
  const isImage = !isPdf && fileUrl;
  const isOwnMessage = member.id === currentMember.id;

  const handleReact = async (emoji: string) => {
    const chatId = params.channelId || params.conversationId;

    if (!chatId) return;
    try {
      await axios.post(`/api/messages/${id}/reaction`, { emoji });
      queryClient.invalidateQueries({ queryKey: [`chat:${chatId}`] });
    } catch (err) {
      console.error("Failed to react", err);
    }
  };

  const commonEmojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

  return (
    <div
      className={cn("flex w-full py-1 p-4", {
        "justify-end": isOwnMessage,
        "justify-start": !isOwnMessage,
      })}
    >
      {!isOwnMessage && showAvatar && (
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition mr-2 mt-auto"
        >
          <UserAvatar src={member.user.imageUrl || ""} />
        </div>
      )}

      <div
        className={cn("flex flex-col", {
          "items-end": isOwnMessage,
          "items-start": !isOwnMessage,
        })}
      >
        {!isOwnMessage && showAvatar && (
          <div className="flex items-center gap-x-2 mb-1">
            <p className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">
              {member.user.name}
            </p>
            <ActionTooltip label={member.role}>
              {roleIconMap[member.role]}
            </ActionTooltip>
          </div>
        )}
        <div className="relative group">
          <div className={cn("flex flex-col gap-y-1 rounded-lg max-w-[100%]")}>
            {isImage && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
              >
                <Image
                  src={fileUrl}
                  alt={content}
                  fill
                  className="object-cover"
                />
              </a>
            )}

            {isPdf && (
              <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                  PDF file
                </a>
              </div>
            )}
            {!fileUrl && !isEditing && (
              <div className="flex items-end gap-x-2 p-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-bl-none border rounded-md">
                <p
                  className={cn(
                    "text-sm break-words",
                    isOwnMessage
                      ? "text-zinc-900"
                      : "text-zinc-900 dark:text-zinc-100",
                    deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs"
                  )}
                >
                  {content}
                  {isUpdated && !deleted && (
                    <span className="text-[10px] mx-1 text-zinc-500 dark:text-zinc-400">
                      (edited)
                    </span>
                  )}
                </p>
                <span
                  className={cn(
                    "text-[10px] flex-shrink-0",
                    isOwnMessage
                      ? "text-zinc-900"
                      : "text-zinc-500 dark:text-zinc-400"
                  )}
                >
                  {timestamp}
                </span>
              </div>
            )}

            {!fileUrl && isEditing && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-3">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-x-2 mt-2">
                    <Button disabled={isLoading} size="sm" variant="primary">
                      Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            )}
            {!deleted && reactions.length > 0 && (
              <div className="flex px-3 pb-3 -mt-3 ">
                {reactions.map((emoji, i) => (
                  <span
                    key={i}
                    className="text-lg border blue-500 rounded-lg bg-white px-1 mx-1 shadow-sm z-10"
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            )}
          </div>
          {!deleted && (
            <div
              className={cn(
                "absolute flex gap-1 bg-white dark:bg-zinc-800 border border-zinc-700 rounded-md p-1 shadow-sm z-10",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "-top-8"
              )}
            >
              {commonEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReact(emoji);
                  }}
                  className="w-6 h-6 flex items-center justify-center text-lg rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                >
                  {emoji}
                </button>
              ))}
              <EmojiPicker
                onChange={(emoji: string) => {
                  handleReact(emoji);
                }}
              />
            </div>
          )}
          {canDeleteMessage && (
            <div className="hidden group-hover:flex items-center gap-x-2 absolute -top-2 right-0 bg-white dark:bg-zinc-800 border rounded-sm p-1">
              {canEditMessage && (
                <ActionTooltip label="Edit">
                  <Edit
                    className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-300 transition"
                    onClick={() => setIsEditing(true)}
                  />
                </ActionTooltip>
              )}
              <ActionTooltip label="Delete">
                <Trash
                  className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-300 transition"
                  onClick={() =>
                    onOpen("deleteMessage", {
                      apiUrl: `${socketUrl}/${id}`,
                      query: socketQuery,
                    })
                  }
                />
              </ActionTooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
