import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DestinationsListClient from '@/components/destination/DestinationsListClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'India Tour Packages | Book Travel Packages | GoTravel',
    description: 'Explore 150+ India destinations on GoTravel. Filter by budget, duration, type. Group tours, FIT packages & honeymoon specials from ₹9,999.',
    keywords: 'India tour packages, travel packages India, group tours, FIT packages, honeymoon packages',
    openGraph: { title: 'India Tour Packages | GoTravel', description: 'Explore 150+ India destinations — Kashmir, Goa, Kerala, Manali & more.' },
};

export default function DestinationsPage({ searchParams }: { searchParams: Record<string, string> }) {
    return (
        <>
            <Navbar />
            <main className="pt-24 min-h-screen">
                <DestinationsListClient initialFilters={searchParams} />
            </main>
            <Footer />
        </>
    );
}
