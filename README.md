# ThreeJS Project

This is a monorepo containing a NestJS API and Next.js web application.

## Render Deployment

To deploy the API to Render:

1. **Environment Variables**: Set the following environment variables in Render:

   - `DATABASE_URL`: Your PostgreSQL database URL
   - `NODE_ENV`: `production`

2. **Build Command**: The build command is automatically configured in `render.yaml`

3. **Start Command**: The start command is automatically configured in `render.yaml`

## Local Development

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database

### Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables:

   ```bash
   cd apps/api
   cp .env.example .env
   # Edit .env with your database URL
   ```

3. Generate Prisma client:

   ```bash
   cd apps/api
   pnpm prisma generate
   ```

4. Run database migrations:

   ```bash
   cd apps/api
   pnpm prisma migrate deploy
   ```

5. Start the development servers:
   ```bash
   pnpm dev
   ```

## Project Structure

- `apps/api`: NestJS API application
- `apps/web`: Next.js web application
- `packages/database`: Database package with Prisma schema
- `packages/api-schema`: API schema definitions
- `packages/ui`: Shared UI components
