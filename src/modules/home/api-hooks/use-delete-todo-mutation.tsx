import { TodoAPI } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useDeleteTodoMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, TodoAPI>({
    mutationFn: async (todo) => {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });

      if (res.status > 299) {
        throw new Error("Failed to delete todo");
      }
    },
    onMutate: async (updatedTodo, context) => {
      await context.client.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = context.client.getQueryData(["todos"]);

      // Optimistically update to the new value
      context.client.setQueriesData({ queryKey: ["todos"] }, (old: TodoAPI[]) =>
        old?.filter((todo) => todo.id !== updatedTodo.id)
      );

      return { previousTodos };
    },
    onError: (err) => {
      console.error("Error deleting todo:", err);
      toast.error("Failed to delete todo");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  return mutation;
}
