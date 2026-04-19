import { z } from "zod"

export const taskIdSchema = z.object({
  id: z.string().cuid("Invalid task id"),
})

export const addTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title is too long, maximum characters of 255"),
})