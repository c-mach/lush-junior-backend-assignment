import { prisma } from "../db/prisma"

export type Context = {
  prisma: typeof prisma
}
