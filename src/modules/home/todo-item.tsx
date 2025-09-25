import { Checkbox } from "@/components/ui/checkbox";
import CloseIcon from "@/components/ui/close-icon";
import { TodoAPI } from "@/shared/types";
import { useEffect, useState } from "react";
import useDeleteTodoMutation from "./api-hooks/use-delete-todo-mutation";
import useUpdateTodoMutation from "./api-hooks/use-update-todo-mutation";

export default function TodoItem({ todo }: { todo: TodoAPI }) {
  const [checked, setChecked] = useState(!!todo.completed);
  const { mutate: deleteTodo } = useDeleteTodoMutation();
  const { mutate: updateTodo } = useUpdateTodoMutation();

  return (
    <li className="flex gap-1 border-b items-center border-b-slate-200 py-4 px-2 w-full">
      <Checkbox
        id={todo.id}
        checked={checked}
        onCheckedChange={(checked) => {
          setChecked(checked as boolean);
          updateTodo({
            ...todo,
            completed: checked as boolean,
          });
        }}
        className="scale-150 mr-2"
      />
      <span
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const newTitle = e.currentTarget.textContent?.trim() || "";
          if (newTitle && newTitle !== todo.title) {
            updateTodo({
              ...todo,
              title: newTitle,
            });
          } else {
            e.currentTarget.textContent = todo.title;
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        className={`text-xl ${
          checked ? "line-through text-gray-400" : ""
        }, px-1`}
      >
        {todo.title}
      </span>

      <button
        type="button"
        className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none cursor-pointer ml-auto p-2"
        onClick={() => deleteTodo(todo)}
      >
        <CloseIcon />
      </button>
    </li>
  );
}
