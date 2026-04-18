import { builder } from "./builder"

builder.objectType("Task", {
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
