import { redirect } from "next/navigation";
import { Member, User } from "../../../../db/schema";
import ActionTooltip from "../action-tooltip";
import { roleIconMap } from "../server-member";
import UserAvatar from "../user-avatar";

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
}

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
}: ChatItemProps) => {
  if (!member) {
    return redirect("/me");
  }
  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === "ADMIN";
  const isModerator = currentMember.role === "MODERATOR";
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner;

  const isPdf = fileType === "pdf" && fileUrl;
  const isImage = !isPdf && fileUrl;
  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member?.user?.imageUrl || ""} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member?.user?.name}
              </p>
              <ActionTooltip label={member?.role}>
                {roleIconMap[member?.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            ></a>
          )}
        </div>
      </div>
    </div>
  );
};
