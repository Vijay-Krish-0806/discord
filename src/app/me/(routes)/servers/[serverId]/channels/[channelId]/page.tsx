import { redirect } from "next/navigation";
import { getSession } from "../../../../../../../../lib/auth-utils";
import db from "../../../../../../../../db/drizzle";
import { ChatHeader } from "@/app/components/chat/chat-header";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}
export default async function ChannelIdPage({ params }: ChannelIdPageProps) {
  const profile = await getSession();
  const { serverId, channelId } = await params;
  if (!profile) {
    return redirect("/auth/sign-in");
  }
  const channel = await db.query.channels.findFirst({
    where: (channels, { eq }) => eq(channels.id, channelId),
  });
  const member = await db.query.members.findFirst({
    where: (members, { eq, and }) =>
      and(eq(members.serverId, serverId), eq(members.userId, profile.id)),
  });
  if (!channel || !member) redirect("/me");
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      <div className="flex-1 overflow-auto">Future messages</div>
      <div className="p-4 border-t border-rose-500">
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
}
