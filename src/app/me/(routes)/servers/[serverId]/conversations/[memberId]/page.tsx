import { redirect } from "next/navigation";
import { getSession } from "../../../../../../../../lib/auth-utils";
import db from "../../../../../../../../db/drizzle";
import { getOrCreateConversation } from "../../../../../../../../db/queries";
import { ChatHeader } from "@/app/components/chat/chat-header";
 
interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}
 
export default async function ConversationPage({ params }: MemberIdPageProps) {
  const profile = await getSession();
  if (!profile) {
    return redirect("/auth/sign");
  }
 
  const { memberId, serverId } = await params;
  const currentMember = await db.query.members.findFirst({
    where: (members, { eq, and }) =>
      and(eq(members.serverId, serverId), eq(members.userId, profile.id)),
    with: {
      user: true,
    },
  });
 
  if (!currentMember) {
    return redirect("/me");
  }
 
  const conservation = await getOrCreateConversation(
    currentMember.id,
    memberId
  );
 
  if (!conservation) {
    return redirect(`/me/servers/${serverId}`);
  }
 
  const { memberOne, memberTwo } = conservation;
 
  const otherMember = memberOne.userId === profile.id ? memberTwo : memberOne;
 
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.user.imageUrl || ""}
        name={otherMember.user.name!}
        serverId={serverId}
        type="conversation"
      />
    </div>
  );
}