'use server'

import { db } from "@/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { updateParent } from "./update-parent"

export async function addTodo(formState: null, formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string

  const data: any = { title, description }

  const parentId = formData.get("parentId")
  if (parentId) { data.parentId = Number(parentId) }

  const duration = formData.get("duration")
  if (duration) { data.duration = Number(duration) }

  await db.todo.create({ data })

  if (parentId) {
    await updateParent({ parentId: Number(parentId) })
    revalidatePath(`/todo/${parentId}`)
    redirect(`/todo/${parentId}`)
  }

  revalidatePath(`/todo`)
  redirect(`/todo`)
}
