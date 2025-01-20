# Code Assignment

Welcome to the code assignment! This project is based on the `create-t3-turbo` starter kit, which provides a monorepo setup with Next.js, tRPC, and more. Please follow the instructions below to set up the development environment and deploy your work.

If you encounter any issues with the setup, refer to the original repository for troubleshooting: [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).

---

## Getting Started

### 1. Install Dependencies

Make sure you have [PNPM](https://pnpm.io/) installed globally on your machine.

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Push the database schema
pnpm db:push
```

### 2. Running the Development Environment

Start the development environment by running:

```bash
pnpm dev
```

This will start both the Next.js web application.

- The Next.js app will be available at `http://localhost:3000`

### 3. Deploying the Project

#### Deploying the Next.js App to Vercel

1. Create a new project on [Vercel](https://vercel.com/).
2. Select the `apps/nextjs` folder as the root directory.
3. Add the necessary environment variables (e.g., `DATABASE_URL`).
4. Deploy the project and use the provided URL for further integration.

---

## Assignment Details

**[Add specific code assignment tasks here]**

---

## Additional Notes

- Make sure to commit your code regularly.
- Follow best practices and maintain clean, readable code.
- If you face any blockers, feel free to document them and suggest possible solutions.

Good luck!

