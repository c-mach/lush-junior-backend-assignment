import { GraphQLError } from "graphql"
import { builder } from "./builder"
import { TaskRef } from "./task"
import {
  taskIdSchema,
  addTaskSchema,
  toggleTaskSchema,
  deleteTaskSchema,
  updateTaskTitleSchema
} from "../validation/task"
import { handleZodError } from "../utils/validation"

const ERROR_MESSAGE = {
  INVALID_INPUT: "Invalid input",
  NOT_FOUND: "Task not found",
  CREATE_FAILED: "Failed to create task",
  UPDATE_FAILED: "Failed to update task",
  DELETE_FAILED: "Failed to delete task",
}

builder.queryType({
  fields: (t) => ({
    tasks: t.field({
      type: [TaskRef],
      resolve: async (_root, _args, ctx) => {
        return ctx.prisma.task.findMany({
          orderBy: { createdAt: "desc" },
        })
      },
    }),

    task: t.field({
      type: TaskRef,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const parsed = taskIdSchema.safeParse(args)

        if (!parsed.success) {
          handleZodError(parsed.error, ERROR_MESSAGE.INVALID_INPUT)
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
      type: TaskRef,
      args: {
        title: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const parsed = addTaskSchema.safeParse(args)

        if (!parsed.success) {
          handleZodError(parsed.error, ERROR_MESSAGE.INVALID_INPUT)
        }
        try {
          return await ctx.prisma.task.create({
            data: {
              title: parsed.data.title,
            },
          })
        } catch (error) {
          console.error("addTask error:", error)
          throw new GraphQLError(ERROR_MESSAGE.CREATE_FAILED)
        }
      },
    }),

    toggleTask: t.field({
      type: TaskRef,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const parsed = toggleTaskSchema.safeParse(args)

        if (!parsed.success) {
          handleZodError(parsed.error, ERROR_MESSAGE.INVALID_INPUT)
        }

        const existingTask = await ctx.prisma.task.findUnique({
          where: { id: parsed.data.id },
        })

        if (!existingTask) {
          throw new GraphQLError(ERROR_MESSAGE.NOT_FOUND)
        }

        try {
          return await ctx.prisma.task.update({
            where: { id: parsed.data.id },
            data: {
              completed: !existingTask.completed,
            },
          })
        } catch (error) {
          console.error("toggleTask error:", error)
          throw new GraphQLError(ERROR_MESSAGE.UPDATE_FAILED)
        }
      },
    }),

    deleteTask: t.field({
      type: TaskRef,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const parsed = deleteTaskSchema.safeParse(args)

        if (!parsed.success) {
          handleZodError(parsed.error, ERROR_MESSAGE.INVALID_INPUT)
        }

        const existingTask = await ctx.prisma.task.findUnique({
          where: { id: parsed.data.id },
        })

        if (!existingTask) {
          throw new GraphQLError(ERROR_MESSAGE.NOT_FOUND)
        }

        try {
          return await ctx.prisma.task.delete({
            where: { id: parsed.data.id },
          })
        } catch (error) {
          console.error("deleteTask error:", error)
          throw new GraphQLError(ERROR_MESSAGE.DELETE_FAILED)
        }
      },
    }),

    updateTaskTitle: t.field({
      type: TaskRef,
      args: {
        id: t.arg.string({ required: true }),
        title: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const parsed = updateTaskTitleSchema.safeParse(args)

        if (!parsed.success) {
          handleZodError(parsed.error, ERROR_MESSAGE.INVALID_INPUT)
        }

        const existingTask = await ctx.prisma.task.findUnique({
          where: { id: parsed.data.id },
        })

        if (!existingTask) {
          throw new GraphQLError(ERROR_MESSAGE.NOT_FOUND)
        }

        try {
          return await ctx.prisma.task.update({
            where: { id: parsed.data.id },
            data: {
              title: parsed.data.title,
            },
          })
        } catch (error) {
          console.error("updateTaskTitle error:", error)
          throw new GraphQLError(ERROR_MESSAGE.UPDATE_FAILED)
        }
      },
    }),
  }),
})

export const schema = builder.toSchema()
