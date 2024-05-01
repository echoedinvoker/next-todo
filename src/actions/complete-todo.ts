"use server";

import { db } from "@/db";
import { updateParent } from "./update-parent";
import { revalidatePath } from "next/cache";

export async function completeTodo( _: any, formData: FormData) {
  const id = Number(formData.get("id"));
  const todo = await db.todo.update({
    where: { id },
    data: {
      done: true,
      status: "completed",
    }
  });

  if (todo.parentId) {
    await updateParent(todo.parentId);

    revalidatePath(`/todo/${todo.parentId}`);
  }
    

  revalidatePath(`/todo`);
}
