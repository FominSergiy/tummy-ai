# Tummy AI

This is an [Expo](https://expo.dev) project with a Node.js backend, PostgreSQL database, and MinIO storage.

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Yarn package manager

## Get started

1. Install dependencies

   ```bash
   yarn install
   ```

## Backend Services

### Start Database and File Storage

The project uses PostgreSQL for the database and MinIO for S3-compatible file storage.

Start both services with Docker Compose:

```bash
yarn services:start:daemon
```

To stop the services:

```bash
yarn services:stop
```

**Service URLs:**

- PostgreSQL: `localhost:5432` (postgres/postgres123)
- MinIO API: `http://localhost:9000`
- MinIO Console: `http://localhost:9001` (minioadmin/minioadmin123)

### Start Backend Server

Development mode (with hot reload):

```bash
yarn dev:backend
```

Production mode:

```bash
yarn start:backend
```

Build backend only:

```bash
yarn build:backend
```

## Mobile App

Start the Expo app:

```bash
yarn start
```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo
