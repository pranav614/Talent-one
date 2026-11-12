# Talent One

Next.js app using the App Router, TypeScript, Tailwind CSS, and Supabase for job listings and admin access.

## Local development

Use Node.js 22, then install dependencies and start the app:

```bash
npm ci
npm run dev
```

The included `.devcontainer` creates a Node 22 development container and installs dependencies. Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

The `jobs`, `messages`, `admin_pincode`, and `admin_login_attempts` tables are created in the connected Supabase project. Copy `.env.example` to `.env.local` and set:

- `SUPABASE_URL`: project URL.
- `SUPABASE_PUBLISHABLE_KEY`: publishable key used for public live-job reads.
- `SUPABASE_SECRET_KEY`: secret key used only by server routes for admin operations. Never expose it through a `NEXT_PUBLIC_` variable or commit it.
- `ADMIN_SESSION_SECRET`: a random value of at least 32 characters used to sign admin sessions.

Generate a PIN hash in a terminal (the PIN is not echoed):

```bash
npm run admin:hash-pin
```

In Supabase Table Editor, insert one row into `public.admin_pincode` with `id` set to `1` and `pin_hash` set to the generated value. Do not store the PIN itself. Then visit `/admin` to sign in. PINs must be 4–16 digits. Admin sessions expire after eight hours; failed attempts are rate limited.

The public `/jobs` page shows rows whose `status` is `Live`. The admin `/admin/jobs` page can create jobs as published or draft, edit them, and delete them. Draft jobs are never returned by the public jobs endpoint.

The contact form, employer hiring form, and job enquiry links submit to a server route that stores submissions in `public.messages`. The table is private to server-side operations. In `/admin/messages`, you can filter by message type, audience, and status, then mark messages as read, archive them, or restore them.

## Scripts

- `npm run dev` - start the development server
- `npm run lint` - run ESLint
- `npm run build` - create a production build
- `npm run start` - serve the production build
- `npm run admin:hash-pin` - generate a scrypt PIN hash for the admin table
