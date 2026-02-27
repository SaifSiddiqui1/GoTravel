import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingClient from '@/components/booking/BookingClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Book Your Dream Trip | GoTravel',
    description: 'Book your customized India tour package with GoTravel. Easy booking, Razorpay payment, and instant confirmation.',
};

export default function BookingPage({ searchParams }: { searchParams: Record<string, string> }) {
    return (
        <>
            <Navbar />
            <main className="pt-20 min-h-screen bg-gray-50">
                <BookingClient initialData={searchParams} />
            </main>
            <Footer />
        </>
    );
}
