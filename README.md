# FINTRAKR

FINTRAKR is a modern, multi-user financial portfolio tracker built with Next.js. It helps families and groups track, analyze, and manage investments across platforms with real-time analytics, secure authentication, and a user-friendly dashboard.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Technologies Used](#technologies-used)
- [Deployment](#deployment)
- [License](#license)

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vkondi/finance-tracker.git
   cd fin-tracker
   ```
2. **Install dependencies:**
   ```bash
   yarn install
   ```
3. **Set up environment variables:**
   Create a `.env.local` file in the root directory. See [Environment Variables](#environment-variables).
4. **Run the development server:**
   ```bash
   yarn dev
   ```
5. **Open** http://localhost:3000 in your browser.

---

## Features
- Secure user authentication (Google OAuth, next-auth)
- Responsive dashboard for mobile and desktop
- Real-time portfolio analytics and charts
- Member-wise and category-wise investment tracking
- Add, edit, and delete investments with instant calculations
- Accessible UI (WCAG, keyboard, screen reader friendly)
- Toast notifications for user actions
- Modern, clean design with Tailwind CSS

---

## Environment Variables
Set these in your `.env.local`:
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_DEBUG`
- `GOOGLE_ID`, `GOOGLE_SECRET`
- `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `PGHOST`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`, etc.
- `POSTGRES_URL`, `POSTGRES_USER`, `POSTGRES_HOST`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`, etc.
- `CLOUDFLARE_WEB_ANALYTICS_TOKEN`

---

## Scripts
- `yarn dev` — Start the development server
- `yarn build` — Build for production
- `yarn start` — Start the production server
- `yarn lint` — Run ESLint for code quality
- `yarn a11y-lint` — Run ESLint with accessibility checks (jsx-a11y)

---

## Technologies Used
- [Next.js](https://nextjs.org)
- [next-auth](https://next-auth.js.org)
- [PostgreSQL](https://www.postgresql.org)
- [Tailwind CSS](https://tailwindcss.com)
- React Context API
- [react-toastify](https://fkhadra.github.io/react-toastify)
- [Recharts](https://recharts.org)
- [clsx](https://github.com/lukeed/clsx)
- [react-icons](https://react-icons.github.io/react-icons/)
- [react-responsive](https://github.com/yocontra/react-responsive)
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) (for accessibility)

---

## Deployment
Deploy easily on [Vercel](https://vercel.com):
1. Push your code to GitHub.
2. Connect your repo to Vercel.
3. Set environment variables in the Vercel dashboard.
4. Deploy!

---

## License

MIT License. See [LICENSE](LICENSE) for details.