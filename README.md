# Seedha Cut

Seedha Cut is a privacy friendly  URL shortener without any bloatwares. You paste a long link and get a short one back. You can also see how many people clicked it and their respective analytics. The project is open source and free to use.

## Features the project has:

- **Shorten any link** - Paste a http or https URL and get a short 6 char link

- **Custom Slug** - Choose your own short name, such as `seedha-cut.vercel.app/my-link`.

- **Release date** - The link won't work until the delay you set has passed. First, visitors see a “Not live yet” page.

- **Expiration date** -The link expires after a time period of your choosing.

- **Dashboard** - View all the links you created, open them, or view their analytics.

- **Remove links.** - Delete a link from your list only or permanently delete it with its click data.

- **Click analytics.** -   See total clicks with date, device (mobile or desktop), source (Chrome, Instagram, WhatsApp, etc.) and referrer.

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
I have used neon database for this project but you can use any Postgres database. The connection string should look like this:

   DATABASE_URL=postgresql://user:password@host_psotgresssql
    

3. Set up the database tables:

   npx prisma migrate deploy

4. Start the app:

   npm run dev

Then open http://localhost:3000.
