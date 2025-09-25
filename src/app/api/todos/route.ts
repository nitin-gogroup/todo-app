import { auth } from "@/auth";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { TodoTabsOptions } from "@/shared/constants";
import { TodoAPI } from "@/shared/types";
import { and, eq } from "drizzle-orm";

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return new Response("Unauthorized", { status: 401 });
  }

  const completedFilterQuery = req.nextUrl.searchParams.get(
    "filter"
  ) as TodoTabsOptions;
  let completedFilter: number | undefined;
  switch (completedFilterQuery) {
    case TodoTabsOptions.ACTIVE:
      completedFilter = 0;
      break;
    case TodoTabsOptions.COMPLETED:
      completedFilter = 1;
      break;
    default:
      completedFilter = undefined;
      break;
  }
  console.log(
    "🚀 ~ GET ~ completedFilter:",
    completedFilter,
    completedFilter !== undefined ? completedFilter : undefined
  );

  // Fetch todos from the database for the authenticated user
  const allTodos = await db
    .select()
    .from(todos)
    .where(
      and(
        eq(todos.userId, req.auth.user?.id!),
        completedFilter !== undefined
          ? eq(todos.completed, Number(!!completedFilter))
          : undefined
      )
    );

  return new Response(JSON.stringify(allTodos), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { title } = (await req.json()) as TodoAPI;

  if (!title) {
    return new Response("Title is required", { status: 400 });
  }

  // Insert new todo into the database for the authenticated user
  const [newTodo] = await db
    .insert(todos)
    .values({
      title,
      userId: req.auth.user?.id!,
      completed: 0, // Default to not completed
    })
    .returning();

  return new Response(JSON.stringify(newTodo), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
});
