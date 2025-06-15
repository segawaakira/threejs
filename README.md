## Structure

```
turbo-nest-prisma/
├── apps/
│   ├── api/         # NestJS backend application
│   └── web/         # Next.js frontend application
├── packages/
│   ├── database/    # Prisma schema and client
│   ├── eslint-config/ # Shared ESLint config
│   ├── typescript-config/ # Shared TypeScript config
│   └── ui/          # Shared React components (Shadcn/ui)
├── pnpm-workspace.yaml
├── package.json
└── turbo.json       # Turborepo configuration
```

---

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Environment variables are crucial for configuring database connections, API endpoints, etc.

- **Database:**

  - Create a `.env` file in `packages/database`.
  - Add your `DATABASE_URL`. Example for PostgreSQL:
    ```env
    # packages/database/.env
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"
    ```

- **Backend (`apps/api`):**

  - Create a `.env` file in `apps/api`.
  - Define the `PORT` for the NestJS server (defaults to 3001 if not set).
  - You might need to add the `DATABASE_URL` here as well.
    ```env
    # apps/api/.env
    PORT=3001
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"
    ```

- **Frontend (`apps/web`):**

  - Create a `.env` file in `apps/web`.
  - Define the URL for your backend API:
    ```env
    # apps/web/.env.local
    NEXT_PUBLIC_API_URL=http://localhost:3001 # Adjust port if changed in apps/api/.env
    ```

### 3. Set Up the Database

- Start the database container:
  ```bash
  docker compose up -d
  ```

### 4. Run Database Migrations

Generate the Prisma Client based on your schema.

```bash
pnpm turbo db:generate
```

Apply the Prisma schema to your database:

```bash
# This command reads schema.prisma and applies changes to the database
pnpm turbo db:migrate
```

---

## 5. Development

Run the development servers for all applications simultaneously:

```bash
pnpm turbo dev
```
