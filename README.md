# FINTRAKR

FINTRAKR is a comprehensive multi-user financial portfolio management application built with [Next.js](https://nextjs.org). It enables users to track and analyze their investments across various platforms, from stock trading apps to private banking services. The application features real-time portfolio analytics, member-wise investment tracking, and detailed performance metrics with visual representations. With secure user authentication, responsive design, and intuitive dashboards, it provides a complete solution for families or groups to monitor their collective financial investments.

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
- Dashboard Features:
  - Financial Aggregate Overview:
    - Total Amount Invested with current value comparison
    - Total Absolute Return in currency value
    - Return Percentage (e.g., 5.31%)
    - Total Number of Owners and Platforms
  - Member Allocation:
    - Donut chart visualization of member investments
    - Detailed breakdown with invested amounts and percentages
    - Individual member performance tracking
  - Category Allocation:
    - Donut chart visualization by investment category
    - Breakdown between Investment Apps and Banking Services
    - Category-wise amount and percentage distribution
  - Real-Time Portfolio Insights:
    - Per-member investment amounts and returns
    - Absolute returns in both percentage and currency
    - Quick-view performance metrics
- Finance Tracker Features:
  - Comprehensive Investment Table:
    - Platform details with investment type
    - Owner assignment and tracking
    - Initial investment amount tracking
    - Current value monitoring
    - Absolute return in both ₹ and percentage
    - Precise last updated timestamp (date and time)
  - Investment Management:
    - "Add New" investment functionality
    - Edit investments (via action buttons)
    - Delete investments (via action buttons)
    - Automatic return calculations
  - Data Organization:
    - Clean tabular interface with column headers
    - Support for diverse platform types:
      - Investment Apps (e.g., Paytm Money)
      - Banking Services (e.g., Axis Bank – Burgundy Private & Wealth Services)
    - Time-stamped updates for data freshness

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

Analytics

- `CLOUDFARE_WEB_ANALYTICS_TOKEN`: Token for Cloudflare Web Analytics integration.

---

## Scripts
The following scripts are available in the package.json file:

- `yarn dev`: Starts the development server with Turbopack for faster builds.
- `yarn build`: Builds the application for production.
- `yarn start`: Starts the production server.
- `yarn lint`: Runs ESLint to check for code quality issues.

---

## Technologies Used

- Framework: [Next.js](https://nextjs.org) (v15.3.1)
- Authentication: [next-auth](https://next-auth.js.org) (v4.24)
- Database: [PostgreSQL](https://www.postgresql.org)
- Styling: [Tailwind CSS](https://tailwindcss.com)
- State Management: React Context API
- Notifications: [react-toastify](https://fkhadra.github.io/react-toastify) (v11.0)
- Charts: [Recharts](https://recharts.org) (v2.15)
- UI Utilities: 
  - [clsx](https://github.com/lukeed/clsx) for conditional class names
  - [react-icons](https://react-icons.github.io/react-icons/) for icons
  - [react-responsive](https://github.com/yocontra/react-responsive) for responsive design

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