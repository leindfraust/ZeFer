# ZeFer, tell your story to the world

## Your story is yours to unfold

Join us on this exciting journey as we build not just a platform, but a living, breathing community where stories resonate, ideas flourish, and connections thrive. ZeFer, the open-source publishing platform, awaits, ready to amplify your voice and celebrate the diverse narratives that make us who we are.

## Write in ZeFer, integrate it freely to other platforms with our APIs

We do not limit your blog posts only in our platform, you can freely integrate it to other platforms. We have built an npm package for this. You can check the documentation how to set it up here: <https://docs.zefer.blog/>

## Contributing

Refer to [CONTRIBUTING.md](CONTRIBUTING.md)

## Codebase

### Tech stack

#### Frontend

-   Next.js
-   Tailwind
-   DaisyUI

#### Backend

-   Next.js
-   Prisma (using PostgreSQL)
-   NextAuth
-   Socket.io

#### Error Tracking

-   Sentry.io

### Style guide

We use [ESLint](https://eslint.org/) and [prettier](https://github.com/prettier/prettier). If you have ESLint installed, you should be up and running.

## Getting Started

### Prerequisites

-   Node version 20 or higher
-   A Socket IO server for ZeFer, clone and fork it here <https://github.com/leindfraust/ZeFerSocketIO>

### Installation

1. Fork ZeFer repo here <https://github.com/leindfraust/ZeFer/fork>
2. Clone your forked repository by running `git clone https://github.com/<your-username>/zefer.git`
3. Populate .env.example and .env.local.example and remove .example once done. Do not modify NEXTAUTH_URL default value unless you use different port
4. Install packages by running `npm install`
5. You're now ready! Just run `npm run dev` to start application and navigate to `localhost:3000`

## License

Refer to [LICENSE](LICENSE)
