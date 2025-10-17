import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { messages } from "../../../../../../db/schema";
import db from "../../../../../../db/drizzle";
export async function POST(
  req: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    const { emoji } = await req.json();
    if (!emoji || typeof emoji !== "string" || emoji.length > 10) {
      return new Response("Invalid emoji", { status: 400 });
    }
    const existingMessage = await db.query.messages.findFirst({
      where: eq(messages.id, messageId),
    });
 
    if (!existingMessage) {
      return new Response("Message not found", { status: 404 });
    }
 
    const currentReactions = existingMessage.reactions || [];
    const exists = currentReactions.includes(emoji);
    const newReactions = exists
      ? currentReactions.filter((r) => r !== emoji) 
      : [...currentReactions, emoji]; 
    await db
      .update(messages)
      .set({
        reactions: newReactions,
        updatedAt: new Date(),
      })
      .where(eq(messages.id, messageId));
 
    return new Response(JSON.stringify({ success: true, reactions: newReactions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[REACTION_POST]", error);
    return new Response("Internal Error", { status: 500 });
  }
}