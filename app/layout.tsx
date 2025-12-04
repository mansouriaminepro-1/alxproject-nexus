
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
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