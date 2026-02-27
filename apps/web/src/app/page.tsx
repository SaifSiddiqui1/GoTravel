import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedDestinations from '@/components/home/FeaturedDestinations';
import StatsSection from '@/components/home/StatsSection';
import FITTeaser from '@/components/home/FITTeaser';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import NewsletterSection from '@/components/home/NewsletterSection';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
    title: 'GoTravel - India\'s Premier Travel Experience | Book Now',
    description: 'Discover magical India with GoTravel. Customized Kashmir, Goa, Kerala, Manali & Rajasthan tours. FIT packages, group tours & honeymoon specials starting ₹9,999.',
};

const travelAgencySchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'GoTravel',
    description: 'India\'s premier travel company offering customized tours, FIT packages, and group travel experiences.',
    url: 'https://gotravel.in',
    logo: 'https://gotravel.in/logo.png',
    telephone: '+91-98765-43210',
    address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressRegion: 'Maharashtra', addressCountry: 'IN' },
    priceRange: '₹9,999 - ₹59,999',
    sameAs: ['https://instagram.com/gotravel_india', 'https://facebook.com/gotravelindia'],
};

export default function HomePage() {
    return (
        <>
            <JsonLd data={travelAgencySchema} />
            <Navbar />
            <main>
                <HeroSection />
                <FeaturedDestinations />
                <StatsSection />
                <FITTeaser />
                <WhyChooseUs />
                <TestimonialsSection />
                <NewsletterSection />
            </main>
            <Footer />
        </>
    );
}
