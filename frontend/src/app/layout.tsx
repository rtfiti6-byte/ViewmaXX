import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from '@/components/providers/SocketProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: process.env.NEXT_PUBLIC_DEFAULT_TITLE || 'ViewmaXX - Video Sharing Platform',
  description: process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION || 'Upload, share, and discover amazing videos on ViewmaXX',
  keywords: process.env.NEXT_PUBLIC_DEFAULT_KEYWORDS || 'video sharing, upload videos, watch videos, streaming',
  authors: [{ name: 'MiniMax Agent' }],
  creator: 'MiniMax Agent',
  publisher: 'ViewmaXX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: process.env.NEXT_PUBLIC_DEFAULT_TITLE || 'ViewmaXX',
    description: process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION || 'The ultimate video sharing platform',
    siteName: 'ViewmaXX',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ViewmaXX - Video Sharing Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_PUBLIC_DEFAULT_TITLE || 'ViewmaXX',
    description: process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION || 'The ultimate video sharing platform',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <SocketProvider>
            <div className="min-h-screen bg-white dark:bg-dark-900">
              <Header />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 min-h-screen">
                  {children}
                </main>
              </div>
              <Footer />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'dark:bg-dark-800 dark:text-white',
              }}
            />
          </SocketProvider>
        </Providers>
      </body>
    </html>
  );
}
