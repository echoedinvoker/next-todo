import { db } from "@/db"

export async function updateParent(parentId: number) {
  const parent = await db.todo.findUnique({
    where: { id: parentId },
    include: { children: true },
  })

  if (!parent) { return }

  const status = !parent.children.length ? "not-started"
    : parent.children.every((child) => child.status === "completed") ? "completed"
    : parent.children.every((child) => child.status === "not-started") ? "not-started"
    : "inporgress"

  const duration = parent.children.reduce((acc, child) => acc + child.duration, 0)
  
  await db.todo.update({
    where: { id: parentId },
    data: { status, duration },
  })

  if (parent.parentId) {
    await updateParent(parent.parentId)
  }
}
