import { GraphQLError } from "graphql"
import { builder } from "./builder"
import "./task"
import { taskIdSchema, addTaskSchema } from "../validation/task"

const DEFAULT_ERROR_MESSAGE = "Invalid input"

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

    task: t.field({
      type: "Task",
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const parsed = taskIdSchema.safeParse(args)

        if (!parsed.success) {
          throw new GraphQLError(
            parsed.error.issues[0]?.message ?? DEFAULT_ERROR_MESSAGE,
          )
        }

        const task = await ctx.prisma.task.findUnique({
          where: { id: parsed.data.id },
        })

        if (!task) {
          throw new GraphQLError("Task not found")
        }

        return task
      },
    }),
  }),
})

builder.mutationType({
  fields: (t) => ({
    addTask: t.field({
      type: "Task",
      args: {
        title: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const parsed = addTaskSchema.safeParse(args)

        if (!parsed.success) {
          throw new GraphQLError(
            parsed.error.issues[0]?.message ?? DEFAULT_ERROR_MESSAGE,
          )
        }

        return ctx.prisma.task.create({
          data: {
            title: parsed.data.title,
          },
        })
      },
    }),
  }),
})

export const schema = builder.toSchema()
