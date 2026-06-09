import type { Metadata } from 'next';
import Link from 'next/link';
import { collectionJsonLdHref, isStaticBuild } from '@/lib/liveData';
import './globals.css';

export const metadata: Metadata = {
  title: 'Oir Artifact Repository',
  description:
    'A linked-data repository and exhibition of archaeological artifacts, described with Dublin Core and CIDOC CRM.',
};

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/browse', label: 'Browse' },
  { href: '/exhibits', label: 'Exhibits' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <header className="border-b border-stone-300 bg-stone-900 text-stone-100">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-amber-200">Oir</span>
              <span className="hidden text-sm text-stone-300 sm:inline">Artifact Repository</span>
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-1.5 text-stone-200 hover:bg-stone-800 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              {!isStaticBuild && (
                <Link
                  href="/admin"
                  className="ml-2 rounded-md border border-amber-300/40 px-3 py-1.5 text-amber-200 hover:bg-amber-200/10"
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-stone-500">
            <p>
              Oir Artifact Repository — artifact records are stored and served as JSON-LD, using
              Dublin Core Terms, CIDOC CRM, and Schema.org.{' '}
              <a href={collectionJsonLdHref()} className="text-emerald-800 underline">
                Download the full collection
              </a>
              .
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
