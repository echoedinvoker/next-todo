'use server'

import { db } from "@/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { updateParent } from "./update-parent"

export async function addTodo( _: any, formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const duration = Number(formData.get("duration"))

  const data: any = { title, description, duration }

  const parentId = formData.get("parentId")

  if (parentId) {
    data.parentId = Number(parentId)
  }

  await db.todo.create({ data })

  if (parentId) {
    await updateParent(Number(parentId))
    revalidatePath(`/todo/${parentId}`)
    redirect(`/todo/${parentId}`)
  }

  revalidatePath(`/todo`)
  redirect(`/todo`)
}
