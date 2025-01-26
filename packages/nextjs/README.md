# Mobile First Web App

This is a mobile first web app built with Next.js.

## Getting Started

### Prerequisites

### Drizzle with Vercel Postgres

[Docs](https://orm.drizzle.team/docs/tutorials/drizzle-with-vercel)

Generate migrations:

```bash
npx drizzle-kit generate

```

Run the migrations:

```bash
npx drizzle-kit migrate
```

Push changes without migrations:

```bash
npx drizzle-kit push
```

#### Vercel Blob Storage

To be able to use the blob storage and postgres on local you will have to run the following command:

```bash
vercel env pull
```

> Notice that on local the onUploadCompleted won't succeed as Vercel Blob cannot contact localhost. (use Ngrok to expose your localhost to the internet)

First, run the development server:

```bash
yarn dev
```
