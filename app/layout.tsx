import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Turkish Airlines Flight Menu',
  description: 'Digital menu system for Turkish Airlines flights',
  icons: {
    icon: '/thyicon.png' 
  }
};

export const viewport = {
  content: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}
