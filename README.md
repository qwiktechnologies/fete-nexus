# Fete Nexus Logistics & Removals

Company site for bookings, listed services, invoices, deposits and in-app messages.

## Run it locally

Postgres runs in Docker so the same schema works on Neon later.

```bash
docker compose up -d
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Open http://localhost:3000

Copy `.env.example` to `.env` if you do not already have one. The seeded super admin is in `.env`:

- Email: `admin@fetenexus.co.uk`
- Password: the value of `SEED_ADMIN_PASSWORD`

Change that password from the account page after the first sign-in.

## Neon

Put the Neon connection string in `DATABASE_URL`. Use `sslmode=require`. Then run the same Prisma migrate and seed commands.

## Card deposits

Bank details stay under Admin → Settings. Stripe keys are entered under Admin → Payment config: secret key, publishable key, and webhook signing secret. Until a secret key is saved, customers pay the deposit by bank transfer. After it is saved, the invoice shows **Pay deposit by card**.

In Stripe, point a webhook at `/api/stripe/webhook` on this site and send `checkout.session.completed`. The payment config screen shows the full address.

## What the office can do

- Accept, reject, quote and invoice a booking
- Mark a bank deposit as received
- See payments and customers
- Create staff and customer accounts
- Add and edit services, including fixed prices
- Write Community articles
- Update the phone, email, address and the rest of the seeded company details
- Enter Stripe keys on the payment config screen

Quotes, invoices and booking chat stay in the account. The site does not send email notifications.
