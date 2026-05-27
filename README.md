# Full-stack Developer Portfolio (Next.js + Tailwind + MongoDB)

Features:
- Next.js pages for public site and admin dashboard
- Tailwind CSS for responsive UI
- Mongoose + MongoDB for data
- Simple JWT auth via `/api/auth/login` cookie
- CRUD APIs for `projects` (extendable for experience, skills, blogs)
- CRUD APIs for `projects` and `experience` (extendable for skills, certifications, blogs)

Quick start:

1. Copy repo to your machine.
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.local.example` to `.env.local` and fill in your values:

```
MONGODB_URI=mongodb+srv://user:pass@cluster/db
JWT_SECRET=some-long-secret
ADMIN_USER=you
ADMIN_PASS=strongpassword
```

4. Run dev server:

```bash
npm run dev
```

Visit `http://localhost:3000` and `http://localhost:3000/admin/login`.

Admin: after logging in, the dashboard has tabs to manage `Projects` and `Experience`. Create, edit, and delete entries from the UI without changing code.

Notes:
- This scaffold focuses on `projects`. Add similar models and API routes for `experience`, `skills`, `certifications`, and `blogs`.
- For production, secure the admin credentials and use an OAuth provider or NextAuth for richer auth.
- Add image uploads, rich-text editor, and pagination as next steps.
