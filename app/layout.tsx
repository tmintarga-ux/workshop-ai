import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { FilterProvider } from "@/lib/filters";

export const metadata: Metadata = {
  title: "Sawit Insight",
  description: "Perencanaan, proyeksi, dan pengendalian produksi TBS serta kesiapan tenaga panen.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <FilterProvider>{children}</FilterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
