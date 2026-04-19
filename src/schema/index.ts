import { GraphQLError } from "graphql"
import { builder } from "./builder"
import "./task"
import {
  taskIdSchema,
  addTaskSchema,
  toggleTaskSchema,
  deleteTaskSchema,
} from "../validation/task"

const ERROR_MESSAGE = {
  INVALID_INPUT: "Invalid input",
  NOT_FOUND: "Task not found",
}

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
            parsed.error.issues[0]?.message ?? ERROR_MESSAGE.INVALID_INPUT,
          )
        }

        const task = await ctx.prisma.task.findUnique({
          where: { id: parsed.data.id },
        })

        if (!task) {
          throw new GraphQLError(ERROR_MESSAGE.NOT_FOUND)
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
            parsed.error.issues[0]?.message ?? ERROR_MESSAGE.INVALID_INPUT,
          )
        }

        return ctx.prisma.task.create({
          data: {
            title: parsed.data.title,
          },
        })
      },
    }),

    toggleTask: t.field({
      type: "Task",
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const parsed = toggleTaskSchema.safeParse(args)

        if (!parsed.success) {
          throw new GraphQLError(
            parsed.error.issues[0]?.message ?? ERROR_MESSAGE.INVALID_INPUT,
          )
        }

        const existingTask = await ctx.prisma.task.findUnique({
          where: { id: parsed.data.id },
        })

        if (!existingTask) {
          throw new GraphQLError(ERROR_MESSAGE.NOT_FOUND)
        }

        return ctx.prisma.task.update({
          where: { id: parsed.data.id },
          data: {
            completed: !existingTask.completed,
          },
        })
      },
    }),

    deleteTask: t.field({
      type: "Task",
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const parsed = deleteTaskSchema.safeParse(args)

        if (!parsed.success) {
          throw new GraphQLError(
            parsed.error.issues[0]?.message ?? ERROR_MESSAGE.INVALID_INPUT,
          )
        }

        const existingTask = await ctx.prisma.task.findUnique({
          where: { id: parsed.data.id },
        })

        if (!existingTask) {
          throw new GraphQLError(ERROR_MESSAGE.NOT_FOUND)
        }

        return ctx.prisma.task.delete({
          where: { id: parsed.data.id },
        })
      },
    }),
  }),
})

export const schema = builder.toSchema()
