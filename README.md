# Lush Junior Backend Assignment by Carman Mach

This is a simple GraphQL API for managing a list of tasks. I built this as part of a junior backend take-home assignment to demonstrate working with GraphQL, Prisma, validation, and basic backend patterns.

## Tech Stack

* Node.js
* TypeScript
* GraphQL Yoga
* Pothos
* Prisma
* SQLite 
* Zod 
* Vitest 

## What it does

You can create, read, update, and delete tasks through GraphQL.

### Queries

* `tasks` — get all tasks
* `task(id)` — get a single task

### Mutations

* `addTask(title)` — create a new task
* `toggleTask(id)` — mark a task complete/incomplete
* `deleteTask(id)` — delete a task
* `updateTaskTitle(id, title)` — update a task’s title *(added as a small bonus)*

## Data model

Each task has:

* `id`
* `title`
* `completed`
* `createdAt`
* `updatedAt`

## Running the project

### Install dependencies

```bash
npm install
```

### Set up the database

```bash
npx prisma migrate dev
```

This creates a local SQLite database at `prisma/dev.db`.

### Start the server

```bash
npm run dev
```

Then open:

```
http://localhost:4000/graphql
```

## Running tests

```bash
npm test
```

Tests cover the main GraphQL operations and validation behavior.

## Validation and errors

* All inputs are validated using Zod
* Invalid input returns clear error messages
* If a task doesn’t exist, the API returns `"Task not found"`
* Database operations are wrapped with basic error handling to avoid leaking internal errors

## Notes

I kept the API simple and focused on:

* clear schema design with Pothos
* input validation
* clean resolver logic
* basic but meaningful tests

I also added `updateTaskTitle` as a small extra feature.
