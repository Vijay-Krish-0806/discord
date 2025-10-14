import { eq, and, sql } from "drizzle-orm";
import db from "./drizzle";
import { members, servers } from "./schema";

export const getServer = async (id: string) => {
  const server = await db
    .select({
      id: servers.id,
      name: servers.name,
      imageUrl: servers.imageUrl,
      inviteCode: servers.inviteCode,
      userId: servers.userId,
    })
    .from(servers)
    .innerJoin(members, eq(members.serverId, servers.id))
    .where(eq(members.userId, id))
    .limit(1);

  return server[0];
};
