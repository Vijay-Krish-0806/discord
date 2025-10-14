"use client";

import { useState } from "react";
import { useModal } from "../../../../hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "../user-avatar";
import { ShieldAlert, ShieldCheck } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

export default function MembersModal() {
  const { onClose, type, data, isOpen } = useModal();

  const isOpenModal = isOpen && type === "members";

  const [loadingId, setIsLoadingId] = useState("");

  const { server } = data as { server: ServerWithMembersWithProfiles };

  return (
    <>
      <Dialog open={isOpenModal} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black overflow-hidden">
          <DialogHeader className="pt-6 px-2">
            <DialogTitle className="text-2xl text-center font-bold">
              Manage Members
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              {server?.members?.length} Members
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-8 max-h-[420px] pr-6">
            {server?.members?.map((member) => (
              <div key={member.id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member.user.imageUrl || undefined} />
                <div className="flex flex-col gap-y-1">
                  <div className="text-c=xs font-semibold flex items-center gap-x-1">
                    {member.user.name}
                    {roleIconMap[member.role]}
                  </div>
                  <p className="text-xs text-zinc-500">{member.user.email}</p>
                </div>
                {server.userId !== member.userId && loadingId !== member.id && (
                  <div className="ml-auto">Actions</div>
                )}
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
