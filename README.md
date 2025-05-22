# Finance Tracker

Finance Tracker is a web application built with [Next.js](https://nextjs.org) that helps users manage track their finances across various platforms. It provides features such as user registration, financial platform configurations, and responsive design for mobile and desktop users.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Technologies Used](#technologies-used)
- [Deployment](#deployment)
- [License](#license)

---

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/vkondi/finance-tracker.git
   cd fin-tracker
   ```
2. Install dependencies:

   ```bash
   yarn install
   ```
3. Set up environment variables by creating a .env.local file in the root directory. Refer to the [Environment Variables](#environment-variables) section for required variables.
4. Run the development server:

   ```bash
   yarn dev
   ```
5. Open http://localhost:3000 in your browser to view the application.

---

## Features
- User Authentication: Integrated with next-auth for secure user login and session management.
- Financial Platform Management: Fetch and display financial platforms from the backend.
- Responsive Design: Optimized for both mobile and desktop devices using react-responsive.
- Toast Notifications: User-friendly notifications powered by react-toastify.

---

## Folder Structure

```
.
├── .next/                # Build artifacts
├── public/               # Static assets
├── src/
│   ├── app/              # APIs and Navigation routes
│   ├── components/       # Reusable UI components
│   ├── context/          # Context providers (e.g., RootContext)
│   ├── lib/              # Middlware helpers
│   └── utils/            # Utility functions
│   └── middleware.ts     # Middleware logic handling
├── .env.local            # Environment variables
├── package.json          # Project metadata and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

---

## Environment Variables
The application requires the following environment variables to be set in a .env.local file:

Authentication

- `NEXTAUTH_URL`: The base URL for the application.
- `NEXTAUTH_SECRET`: A secret key for `next-auth` session encryption 
- `NEXTAUTH_DEBUG`: Set to true to enable debug mode for `next-auth`.

Google OAuth

- `GOOGLE_ID`: The client ID for Google OAuth integration.
- `GOOGLE_SECRET`: The client secret for Google OAuth integration.

Database Configuration

- `DATABASE_URL`: Connection string for the PostgreSQL database (with connection pooling).
- `DATABASE_URL_UNPOOLED`: Connection string for the PostgreSQL database (without connection pooling).
- `PGHOST`: Hostname for the PostgreSQL database (with connection pooling).
- `PGHOST_UNPOOLED`: Hostname for the PostgreSQL database (without connection pooling).
- `PGUSER`: Username for the PostgreSQL database.
- `PGDATABASE`: Name of the PostgreSQL database.
- `PGPASSWORD`: Password for the PostgreSQL database.

Vercel Postgres Templates

- `POSTGRES_URL`: Connection string for the PostgreSQL database (with connection pooling).
- `POSTGRES_URL_NON_POOLING`: Connection string for the PostgreSQL database (without connection pooling).
- `POSTGRES_USER`: Username for the PostgreSQL database.
- `POSTGRES_HOST`: Hostname for the PostgreSQL database (with connection pooling).
- `POSTGRES_PASSWORD`: Password for the PostgreSQL database.
- `POSTGRES_DATABASE`: Name of the PostgreSQL database.
- `POSTGRES_URL_NO_SSL`: Connection string for the PostgreSQL database without SSL.
- `POSTGRES_PRISMA_URL`: Connection string for the PostgreSQL database with Prisma-specific parameters (e.g., `connect_timeout`).

---

## Scripts
The following scripts are available in the package.json file:

- `yarn dev`: Starts the development server.
- `yarn build`: Builds the application for production.
- `yarn start`: Starts the production server.
- `yarn lint`: Runs ESLint to check for code quality issues.

---

## Technologies Used

- Framework: [Next.js](https://nextjs.org)
- Authentication: [next-auth](https://next-auth.js.org)
- Database: [PostgreSQL](https://www.postgresql.org)
- Styling: [Tailwind CSS](https://tailwindcss.com)
- State Management: React Context API
- Notifications: [react-toastify](https://fkhadra.github.io/react-toastify)
- Charts: [Recharts](https://recharts.org)

---

## Deployment
The easiest way to deploy this application is via [Vercel](https://vercel.com). Follow these steps:

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Set up environment variables in the Vercel dashboard.
4. Deploy the application.

For more details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---