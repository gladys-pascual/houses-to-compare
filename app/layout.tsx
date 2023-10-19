import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Houses to compare',
  description:
    'An app to help home buyers systematically rate houses they want to buy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <Providers>
        <body className={inter.className}>
          {' '}
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <Navbar />
            {children}
          </ThemeProvider>
        </body>
      </Providers>
    </html>
  );
}
