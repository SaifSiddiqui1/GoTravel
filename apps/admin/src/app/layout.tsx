import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: { default: 'GoTravel Admin', template: '%s | GoTravel Admin' },
    description: 'GoTravel Admin Dashboard',
    robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
                <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a2e', color: 'white', borderRadius: '12px' } }} />
            </body>
        </html>
    );
}
