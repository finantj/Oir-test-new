import "./globals.css";
import { EB_Garamond } from "next/font/google";

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
});

export const metadata = {
  title: "Oir Project",
  description: "Linking Ireland’s Past, One Record at a Time",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={garamond.variable}>
      <body className="min-h-screen bg-oir text-oir-cream antialiased">{children}</body>
    </html>
  );
}
