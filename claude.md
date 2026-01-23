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
- Start database: `yarn services:start:daemon` or `docker-compose -f backend/docker-compose.yml up -d postgres`
- Stop database: `yarn services:stop` or `docker-compose -f backend/docker-compose.yml down`
- **Schema management will be handled with Prisma ORM**
- **Use string-based IDs** with `uuid()` as default for all Prisma schema models

## S3 Storage (MinIO)

- MinIO S3-compatible storage for file uploads
- MinIO Web Console: http://localhost:9001 (minioadmin/minioadmin123)
- MinIO API Endpoint: http://localhost:9000
- Bucket name: `tummy-ai-uploads`
- Start MinIO: `yarn services:start:daemon` (starts both database and MinIO)
- Environment variables configured in `.env` file
- Use AWS SDK v3 with S3_FORCE_PATH_STYLE=true for compatibility

## Code Style

- **Use arrow functions** instead of function declarations
  - Prefer: `const myFunction = () => { ... }`
  - Avoid: `function myFunction() { ... }`

## Frontend Development (src/)

- **Use memoization** to prevent unnecessary re-renders:
  - `useCallback` for functions passed to children or used in dependency arrays
  - `useMemo` for objects, arrays, and expensive calculations
  - `useMemo` for React Context provider values
- **Context providers** must wrap their value in `useMemo` and callbacks in `useCallback`
- **Functions in useEffect dependency arrays** must be wrapped in `useCallback`
