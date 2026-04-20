import { builder } from "./builder"

type TaskShape = {
  id: string
  title: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export const TaskRef = builder.objectRef<TaskShape>("Task")

TaskRef.implement({
  fields: (t) => ({
    id: t.exposeString("id"),
    title: t.exposeString("title"),
    completed: t.exposeBoolean("completed"),
    createdAt: t.string({
      resolve: (task) => task.createdAt.toISOString(),
    }),
    updatedAt: t.string({
      resolve: (task) => task.updatedAt.toISOString(),
    }),
  }),
})
