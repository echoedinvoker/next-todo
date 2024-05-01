'use server'

import { db } from "@/db"
import { revalidatePath } from "next/cache"
import { updateParent } from "./update-parent"

export async function deleteTodo(id: number) {
  const parentId = (await db.todo.findUnique({ where: { id } }))?.parentId
  await deleteChildren(id)
  await db.todo.delete({ where: { id } })
  if (parentId) {
    await updateParent(parentId)
  }

  revalidatePath("/")
}

async function deleteChildren(id: number) {
  const children = await db.todo.findMany({ where: { parentId: id } })

  for (const child of children) {
    await deleteChildren(child.id)
  }

  await db.todo.deleteMany({ where: { parentId: id } })
}

