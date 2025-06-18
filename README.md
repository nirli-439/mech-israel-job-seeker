# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e31a99a2-012c-4143-bbd2-c66d6aaae236

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e31a99a2-012c-4143-bbd2-c66d6aaae236) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e31a99a2-012c-4143-bbd2-c66d6aaae236) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Persisting data with Supabase

This app can store the job source list in a Supabase table. Without these
settings the list is only kept in your browser's `localStorage`.

1. [Create a Supabase project](https://app.supabase.com/) and copy the **Project URL** and **Anon Key**.
2. Create a table called `job_sources` with columns:
   - `id` (text, primary key)
   - `name` (text)
   - `url` (text)
   - `updated_at` (timestamp)
3. Duplicate `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   In Lovable you can set these under **Project → Settings → Environment**.

When these variables are provided, edits to the sources list will be saved to
Supabase and loaded across devices.

## Running Supabase locally

You can spin up a local Supabase instance alongside the web app using Docker.
Copy `.env.example` to `.env` and set `SUPABASE_DB_PASSWORD` to any password.

Start the stack:

```sh
docker compose up
```

This starts the `web` and `supabase` services. The app is served on
<http://localhost:3000> and the Supabase container logs print the API URL and
anonymous key. Copy these values into `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` in `.env`.

To stop the stack:

```sh
docker compose down
```


## Running with Docker

You can build and run the application using Docker. Copy `.env.example` to `.env` and
set the Supabase variables described above. Then run:

```sh
docker compose up --build
```

This launches both the web app and the Supabase container. The application will be
available on [http://localhost:3000](http://localhost:3000).

## Netlify CMS

A basic Netlify CMS setup lives in the `admin/` folder. The Docker image copies
this folder into the final build so the CMS is served from `/admin`.

To try it locally run the proxy server service:

```sh
docker compose up cms
```

This starts the Netlify CLI and serves the CMS at <http://localhost:8081>. You
can also run `npx netlify-cms-proxy-server` outside Docker if preferred.

## Deploying to Netlify

Netlify reads `netlify.toml` to build the app with `npm run build` and publish
the `dist/` directory. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and any
optional `NETLIFY_AUTH_TOKEN`/`NETLIFY_SITE_ID` variables in your site
configuration. Once deployed, access the CMS at `/admin` on your Netlify site.

