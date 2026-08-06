This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Database (Neon) & file storage (Vercel Blob)

Data operasional (estate, divisi, tren produksi, forecast, alert, riwayat unggahan)
disimpan di Neon (Postgres) lewat `@neondatabase/serverless`, dan file yang diunggah
di halaman Pusat Data disimpan di Vercel Blob lewat `@vercel/blob`.

Kedua integrasi ini sudah terhubung di project Vercel, yang otomatis menyuntikkan
`DATABASE_URL` dan `BLOB_READ_WRITE_TOKEN` saat build/runtime di Vercel — tidak perlu
diisi manual di sana.

Untuk development lokal:

```bash
vercel env pull .env.local   # tarik DATABASE_URL & BLOB_READ_WRITE_TOKEN dari project Vercel
npm run db:migrate           # buat tabel (idempotent, aman dijalankan ulang)
npm run db:seed              # isi data contoh (menimpa isi tabel dengan data awal)
npm run dev
```

`db/schema.sql` adalah sumber kebenaran skema; `db/seed.mts` mengisi data contoh yang
identik dengan mockup awal supaya tampilan dashboard tidak berubah setelah migrasi ke DB.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
