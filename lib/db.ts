import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let cached: NeonQueryFunction<false, false> | null = null;

function client(): NeonQueryFunction<false, false> {
  if (!cached) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL belum diset — hubungkan integrasi Neon di project Vercel ini.");
    }
    cached = neon(connectionString);
  }
  return cached;
}

// Lazy proxy: hanya membaca DATABASE_URL saat query pertama benar-benar dijalankan,
// supaya `next build` (yang meng-import route handlers tanpa env DB) tidak gagal.
function tag(strings: TemplateStringsArray, ...values: unknown[]) {
  return client()(strings, ...values);
}
tag.query = (text: string, params?: unknown[]) => client().query(text, params);

export const sql = tag as unknown as NeonQueryFunction<false, false>;
