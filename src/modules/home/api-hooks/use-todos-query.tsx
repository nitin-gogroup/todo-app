import { TodoTabsOptions } from "@/shared/constants";
import { TodoAPI } from "@/shared/types";
import { useQuery } from "@tanstack/react-query";

export default function useTodoQuery({ status }: { status: TodoTabsOptions }) {
  const query = useQuery<TodoAPI[]>({
    queryKey: ["todos", status],
    queryFn: async () => {
      const response = await fetch(`/api/todos?filter=${status}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  return query;
}
