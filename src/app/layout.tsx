import './globals.css';
export const metadata = { title: 'Oir Project', description: 'Linking Ireland’s Past, One Record at a Time' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
