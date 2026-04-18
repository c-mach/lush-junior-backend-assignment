import { createServer } from "node:http"
import { createYoga } from "graphql-yoga"
import { schema } from "./schema"
import { prisma } from "./db/prisma"

const yoga = createYoga({
  schema,
  context: async () => ({
    prisma,
  }),
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.log("Server running at http://localhost:4000/graphql")
})
