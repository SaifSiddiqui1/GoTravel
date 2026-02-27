import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/providers/AuthProvider';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import ChatbotWidget from '@/components/chat/ChatbotWidget';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gotravel.in'),
    title: { default: 'GoTravel - India\'s Premier Travel Experience', template: '%s | GoTravel' },
    description: 'Book customized India tour packages with GoTravel. Expert-curated itineraries, FIT packages, group tours, and honeymoon specials. Explore Kashmir, Manali, Goa, Kerala & more.',
    keywords: ['India travel', 'tour packages India', 'GoTravel', 'Kashmir tour', 'Goa packages', 'Kerala backwaters', 'FIT travel', 'group tours'],
    authors: [{ name: 'GoTravel' }],
    creator: 'GoTravel',
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        siteName: 'GoTravel',
        title: 'GoTravel - India\'s Premier Travel Experience',
        description: 'Discover India with expert-crafted tour packages. Kashmir, Goa, Kerala, Rajasthan & more.',
        images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'GoTravel' }],
    },
    twitter: { card: 'summary_large_image', creator: '@gotravel_india' },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    verification: { google: 'YOUR_GOOGLE_SEARCH_CONSOLE_ID' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="canonical" href="https://gotravel.in" />
            </head>
            <body className={inter.className}>
                <GoogleAnalytics />
                <AuthProvider>
                    {children}
                    <ChatbotWidget />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: { background: '#1a1a2e', color: 'white', borderRadius: '12px', padding: '12px 16px' },
                            success: { iconTheme: { primary: '#FF6B35', secondary: 'white' } },
                        }}
                    />
                </AuthProvider>
            </body>
        </html>
    );
}
