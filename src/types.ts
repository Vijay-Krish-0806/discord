import { Server, Member, Channel, User } from "../db/schema";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & {
    user: User;
  })[];
  channels: Channel[];
};
