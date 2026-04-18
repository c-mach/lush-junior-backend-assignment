import { builder } from "./builder"
import "./task"

builder.queryType({
  fields: (t) => ({
    tasks: t.field({
      type: ["Task"],
      resolve: async (_root, _args, ctx) => {
        return ctx.prisma.task.findMany({
          orderBy: { createdAt: "desc" },
        })
      },
    }),
  }),
})

export const schema = builder.toSchema()
