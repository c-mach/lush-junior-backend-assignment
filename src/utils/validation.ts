import { GraphQLError } from "graphql"
import { ZodError } from "zod"

export function handleZodError(error: ZodError, fallback: string):never {
  throw new GraphQLError(error.issues[0]?.message ?? fallback)
}
