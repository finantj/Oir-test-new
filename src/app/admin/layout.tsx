import Link from 'next/link';

const adminLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/items', label: 'Items' },
  { href: '/admin/import', label: 'Import JSON-LD' },
  { href: '/admin/exhibits', label: 'Exhibits' },
  { href: '/admin/vocabularies', label: 'Vocabularies' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[200px,1fr]">
      <aside>
        <p className="label">Administration</p>
        <nav className="card flex flex-col p-1.5 text-sm">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-stone-700 hover:bg-emerald-50 hover:text-emerald-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
