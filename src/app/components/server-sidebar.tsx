import { redirect } from "next/navigation";
import { getSession } from "../../../lib/auth-utils";
import db from "../../../db/drizzle";
import { ServerHeader } from "./server-header";

interface ServerSidebarProps {
  serverId: string;
}
export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await getSession();
  if (!profile) {
    return redirect("/auth/sign-in");
  }
  const server = await db.query.servers.findFirst({
    where: (servers, { eq }) => eq(servers.id, serverId),
    with: {
      channels: {
        orderBy: (channels, { asc }) => [asc(channels.createdAt)],
      },
      members: {
        with: {
          user: true,
        },
        orderBy: (members, { asc }) => [asc(members.role)],
      },
    },
  });


  //   console.log(server)
  const textChannels = server?.channels.filter(
    (channel) => channel.type === "TEXT"
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === "AUDIO"
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === "VIDEO"
  );

  const memebers = server?.members.filter(
    (member) => member.userId != profile.id
  );

  if (!server) {
    return redirect("/me");
  }

  const role = server.members.find(
    (member) => member.userId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
    <ServerHeader
    server={server}
    role={role}

    />
    </div>
  );
};
