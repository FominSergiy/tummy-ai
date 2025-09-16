# Project Guidelines for Claude

## Package Manager

- **ALWAYS use yarn instead of npm** for all package management tasks
- Use `yarn install` instead of `npm install`
- Use `yarn add` instead of `npm install <package>`
- Use `yarn run <script>` instead of `npm run <script>`

## Backend Development

- Backend server is located in `backend/server.ts`
- Use these yarn scripts for backend development:
  - `yarn dev:backend` - Run server in development mode with hot reload
  - `yarn build:backend` - Build TypeScript to JavaScript
  - `yarn start:backend` - Build and run server in production mode

## Database

- PostgreSQL database configured with Docker Compose
- Database credentials are in `.env` file
- Connection string: `postgresql://postgres:postgres123@localhost:5432/tummy_ai`
- Start database: `docker-compose up -d postgres`
- Stop database: `docker-compose down`
- **Schema management will be handled with Prisma ORM**
