import { TodoAPI } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useCreateTodoMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation<TodoAPI, Error, TodoAPI>({
    mutationFn: async (newTodo) => {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to add todo");
      }
      return data;
    },
    onMutate: async (newTodo, context) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await context.client.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = context.client.getQueryData(["todos"]);

      // Optimistically update to the new value
      context.client.setQueriesData(
        { queryKey: ["todos"] },
        (old?: TodoAPI[]) => [...(old || []), newTodo]
      );

      return { previousTodos };
    },
    onError: (err) => {
      console.error("Error adding todo:", err);
      toast.error("Failed to add todo");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  return mutation;
}
