# Task Player

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169e1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

Task Player is a task-tracking application built with Next.js, React, Prisma, and PostgreSQL. It lets users create tasks, track active work sessions, update task status, and review work by day.

## Features

- Create, start, pause, complete, reopen, and delete tasks.
- Track elapsed time for each task.
- Store completed work sessions in `task_progress_history`.
- Filter the task list by a selected date.
- Show the total worked time for the selected day.
- Responsive task list for desktop and mobile screens.

## Date Filtering

Selecting a date updates the task list immediately. A task is included when it has at least one progress-history record whose `started_at` value falls within the selected calendar day.

The filter deliberately uses `task_progress_history.started_at`, rather than `created_at`: `started_at` represents when the work session actually began, while `created_at` represents when its history record was saved.

The selected date is kept in the URL as `/tasks?date=YYYY-MM-DD`, so the filtered view can be refreshed or shared.

## Requirements

- Node.js
- PostgreSQL database
- A `DATABASE_URL` environment variable with the PostgreSQL connection string

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

## Getting Started

Install dependencies:

```bash
npm install
```

Apply the Prisma migrations:

```bash
npx prisma migrate dev
```

Optionally load the development data:

```bash
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Creates a production build. |
| `npm run start` | Starts the production server after a build. |
| `npm run lint` | Runs ESLint. |
| `npm run db:seed` | Loads development users, tasks, and progress-history records. |

## Main Technologies

- Next.js 16 and React 19
- TypeScript
- Prisma ORM with the PostgreSQL driver adapter
- PostgreSQL
- Tailwind CSS
- TanStack Table
