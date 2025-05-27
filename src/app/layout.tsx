import './globals.css';
import SessionWrapper from '@/components/SessionWrapper'; // ✅ adjust the import if needed

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
