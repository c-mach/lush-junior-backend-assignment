import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { yoga } from "../src/app"
import { prisma } from "../src/db/prisma"

async function graphqlRequest(
  query: string,
  variables?: Record<string, unknown>,
) {
  const response = await yoga.fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  return response.json()
}

describe("Task API", () => {
  beforeEach(async () => {
    await prisma.task.deleteMany()
  })

  afterEach(async () => {
    await prisma.task.deleteMany()
  })

  it("returns an empty tasks list", async () => {
    const result = await graphqlRequest(`
      query {
        tasks {
          id
          title
          completed
        }
      }
    `)

    expect(result.errors).toBeUndefined()
    expect(result.data.tasks).toEqual([])
  })

  it("creates a task with addTask", async () => {
    const result = await graphqlRequest(`
      mutation {
        addTask(title: "Play pickleball") {
          id
          title
          completed
        }
      }
    `)

    expect(result.errors).toBeUndefined()
    expect(result.data.addTask.title).toBe("Play pickleball")
    expect(result.data.addTask.completed).toBe(false)
    expect(result.data.addTask.id).toBeTruthy()
  })

  it("toggles a task's completed status", async () => {
    const task = await prisma.task.create({
      data: {
        title: "Toggle me",
      },
    })

    const result = await graphqlRequest(`
      mutation {
        toggleTask(id: "${task.id}") {
          id
          title
          completed
        }
      }
    `)

    expect(result.errors).toBeUndefined()
    expect(result.data.toggleTask.completed).toBe(true)
  })

  it("returns an error for invalid addTask input", async () => {
    const result = await graphqlRequest(`
      mutation {
        addTask(title: "") {
          id
          title
        }
      }
    `)

    expect(result.errors).toBeDefined()
    expect(result.errors[0].message).toContain("Title is required")
  })
})
