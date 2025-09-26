"use client";
import { Input } from "@/components/ui/input";
import { TodoAPI } from "@/shared/types";
import useCreateTodoMutation from "./api-hooks/use-add-todo-mutation";
import useTodoQuery from "./api-hooks/use-todos-query";
import TodoItem from "./todo-item";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoTabsOptions } from "@/shared/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, LogOutIcon } from "lucide-react";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

export default function TodoHome() {
  const [activeTab, setActiveTab] = useState<TodoTabsOptions>(
    TodoTabsOptions.ALL
  );
  const { mutate } = useCreateTodoMutation();
  const { data: todos, isLoading } = useTodoQuery({ status: activeTab });

  return (
    <section className="mx-auto p-2 w-full">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            data-testid="logout-button"
            onClick={() => signOut()}
            title="logout"
            className="fixed top-2 right-2 items-center cursor-pointer"
          >
            <LogOutIcon />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-xs">Logout</span>
        </TooltipContent>
      </Tooltip>
      <form
        onSubmit={(e) => {
          const target = e.target as HTMLFormElement;
          e.preventDefault();
          const payload: TodoAPI = {
            id: crypto.randomUUID(),
            title: String(new FormData(target).get("new-todo")),
            completed: false,
          };
          mutate(payload);
          target.reset();
        }}
        className="w-full sticky top-0 bg-background z-1"
      >
        <Input
          name="new-todo"
          placeholder="Pending task"
          className="text-xl! py-8! px-6"
          data-testid="todo-input"
        />
      </form>

      <ul>
        {!isLoading && (!todos || todos.length === 0) && (
          <p className="text-center text-xl py-32 text-muted-foreground">
            No todos found
          </p>
        )}
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-[65px] w-full mx-2, mb-1" />
          ))}
        {todos?.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TodoTabsOptions)}
        className="w-full mb-4 fixed bottom-0 left-1/2 -translate-x-1/2 max-w-3xl bg-background"
      >
        <TabsList className="w-full flex">
          <TabsTrigger className="flex-1" value={TodoTabsOptions.ALL}>
            All
          </TabsTrigger>
          <TabsTrigger className="flex-1" value={TodoTabsOptions.ACTIVE}>
            Active
          </TabsTrigger>
          <TabsTrigger className="flex-1" value={TodoTabsOptions.COMPLETED}>
            Completed
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </section>
  );
}
