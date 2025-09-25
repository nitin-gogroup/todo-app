import { TodoAPI } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useUpdateTodoMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation<TodoAPI, Error, TodoAPI>({
    mutationFn: async (todo) => {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to add todo");
      }
      return data;
    },
    onMutate: async (updatedTodo, context) => {
      await context.client.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = context.client.getQueryData(["todos"]);

      // Optimistically update to the new value
      context.client.setQueriesData({ queryKey: ["todos"] }, (old: TodoAPI[]) =>
        old.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );

      return { previousTodos };
    },
    onError: (err) => {
      console.error("Error updating todo:", err);
      toast.error("Failed to update todo");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  return mutation;
}
