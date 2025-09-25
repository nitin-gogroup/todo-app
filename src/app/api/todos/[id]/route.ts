import { auth } from "@/auth";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { TodoAPI } from "@/shared/types";
import { and, eq } from "drizzle-orm";

export const PATCH = auth(async function PATCH(
  req,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!req.auth) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const { title, completed } = (await req.json()) as TodoAPI;

  // Update the todo in the database for the authenticated user
  const [updatedTodo] = await db
    .update(todos)
    .set({ title, completed: Number(!!completed) })
    .where(and(eq(todos.id, id), eq(todos.userId, req.auth.user?.id!)))
    .returning();

  if (!updatedTodo) {
    return new Response("Todo not found", { status: 404 });
  }

  return new Response(JSON.stringify(updatedTodo), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

export const DELETE = auth(async function DELETE(
  req,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!req.auth) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const deletedCount = await db
    .delete(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, req.auth.user?.id!)))
    .returning();

  if (deletedCount.length === 0) {
    return new Response("Todo not found", { status: 404 });
  }

  return new Response(null, { status: 204 });
});
