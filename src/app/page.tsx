import TodoList from "@/components/TodoList";
import { db } from "@/db";

export default async function TodoListPage() {
  const todos = await db.todo.findMany({
    where: { parentId: null },
  })

  return (
    <div className="flex flex-col justify-center py-2 gap-2">
      <TodoList todos={todos} />
    </div>
  );
}
