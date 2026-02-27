import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactClient from '@/components/contact/ContactClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | GoTravel',
    description: 'Get in touch with GoTravel. Our travel experts are available 24/7 to help you plan the perfect India tour.',
};

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <main className="pt-20 min-h-screen bg-gray-50">
                <ContactClient />
            </main>
            <Footer />
        </>
    );
}
