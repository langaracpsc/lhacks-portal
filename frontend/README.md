# LHacks Portal Frontend

This is the frontend for the LHacks Portal, built with [Next.js](https://nextjs.org/) and bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the LHacks Portal.

## Environment Configuration

Create a `.env` file in the root directory with the following variable:

```
API_URL=<BACKEND_URL>
```

This environment variable specifies the URL of the backend API that the frontend will communicate with.

## Project Structure

- `app/`: Contains the main pages and components of the application.
- `components/`: Reusable React components.
- `lib/`: Utility functions and custom hooks.
- `styles/`: Global styles and CSS modules.

You can start editing the main page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Tailwind CSS](https://tailwindcss.com/docs) - learn about the utility-first CSS framework used in this project.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.