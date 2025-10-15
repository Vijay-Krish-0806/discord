import { redirect } from "next/navigation";
import { getSession } from "../../../../../../../../lib/auth-utils";
import db from "../../../../../../../../db/drizzle";
import { ChatHeader } from "@/app/components/chat/chat-header";

interface ChannelIdPageProps{
    params:{
        serverId:string;
        channelId:string;
    }
}
export default async function channelIdPage({params}:ChannelIdPageProps){
    const profile=await getSession();
    if(!profile){
        return redirect('/auth/sign-in');
    }
    const channel = await db.query.channels.findFirst({
    where: (channels, { eq }) => eq(channels.id, params.channelId),
    });
    const member = await db.query.members.findFirst({
    where: (members, { eq, and }) => 
        and(
        eq(members.serverId, params.serverId),
        eq(members.userId, profile.id) // Since profileId = userId
        )
    });
    if(!channel || !member)
        redirect('/me');
    return(
    
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader name={channel.name} serverId={channel.serverId} type="channel" />
        </div>
       
    )
}