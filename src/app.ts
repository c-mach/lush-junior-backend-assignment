import { createYoga } from "graphql-yoga"
import { schema } from "./schema"
import { prisma } from "./db/prisma"

export const yoga = createYoga({
  schema,
  maskedErrors: false,
  context: async () => ({
    prisma,
  }),
})
