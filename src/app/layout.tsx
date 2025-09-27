import './globals.css';

export const metadata = {
  title: 'Oir | Operational Intelligence Reimagined',
  description: 'A canvas for real-time situational awareness, built for modern operations teams.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-transparent text-slate-100 antialiased">{children}</body>
    </html>
  );
}
