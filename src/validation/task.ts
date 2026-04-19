import { z } from "zod"

const INVALID_TASK_ID = "Invalid task id"

export const taskIdSchema = z.object({
  id: z.string().cuid(INVALID_TASK_ID),
})

export const addTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title is too long, maximum characters of 255"),
})

export const toggleTaskSchema = z.object({
  id: z.string().cuid(INVALID_TASK_ID),
})

export const deleteTaskSchema = z.object({
  id: z.string().cuid(INVALID_TASK_ID),
})