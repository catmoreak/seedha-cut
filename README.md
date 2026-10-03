# Seedha Cut

Seedha Cut is a privacy friendly  URL shortener without any bloatwares. You paste a long link and get a short one back. You can also see how many people clicked it and their respective analytics. The project is open source and free to use.

## Features the project has:

- **Shorten any link.** Paste an http or https URL and get a short 6-character link.
- **Custom slug.** Pick your own short name, like `yoursite.com/my-link`.
- **Launch date.** The link only starts working after a time you set. Before that, visitors see a "Not live yet" page.
- **Expiry date.** The link stops working after a time you set.
- **Dashboard.** See all the links you've made, open them, or check their analytics.
- **Delete links.** Remove a link from your list only, or delete it for good, along with its click data.
- **Click analytics.** See the total clicks  with date, device (mobile or desktop), source (Chrome, Instagram, WhatsApp, etc.) and referrer.

## How it works

1. When you shorten a link, the app saves it in a PostgreSQL database with a short code.
2. When someone opens the short link, the app looks up the code. It checks the launch and expiry dates, records the click, and then redirects them to the original URL.
3. Your dashboard list is kept in your browser's localStorage, so there's no login. The list only shows links made from that browser.


## Tech stack

Next.js, Tailwind CSS, Prisma ORM  and PostgreSQL.

## Running it locally

1. Install the dependencies:

   npm install

2. Create a `.env` file with your Postgres connection string:

   DATABASE_URL=postgresql://user:password@host_psotgresssql
   NEXT_PUBLIC_BASE_URL=http://localhost:3000   

3. Set up the database tables:

   npx prisma migrate deploy

4. Start the app:

   npm run dev

Then open http://localhost:3000.
