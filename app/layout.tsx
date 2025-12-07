import { Plus_Jakarta_Sans } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata = {
  title: 'MenuFight',
  description: 'Validate your menu changes with 1-vs-1 polls.',
};

interface RootLayoutProps {
  children?: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export default function RootLayout({
  children,
  showNavbar = true,
  showFooter = true,
}: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className={plusJakartaSans.variable}>
      <head />
      <body suppressHydrationWarning>
        <div className="min-h-screen bg-white flex flex-col overflow-x-hidden font-sans antialiased selection:bg-brand-yellow selection:text-brand-black">
          {showNavbar && <Navbar />}
          <main className="flex-grow">
            {children}
          </main>
          {showFooter && <Footer />}
        </div>
      </body>
    </html>
  );
}