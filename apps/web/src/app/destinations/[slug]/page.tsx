import { getDestinationBySlug, MOCK_DESTINATIONS } from '@/lib/mockData';
import DestinationDetailClient from '@/components/destination/DestinationDetailClient';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return MOCK_DESTINATIONS.map(d => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const dest = getDestinationBySlug(params.slug);
    if (!dest) return {};
    return {
        title: `${dest.name} Tour Packages | GoTravel`,
        description: dest.shortDescription,
        openGraph: { title: `${dest.name} - GoTravel`, description: dest.shortDescription, images: [{ url: dest.heroImage }] },
    };
}

export default function DestinationDetailPage({ params }: { params: { slug: string } }) {
    const dest = getDestinationBySlug(params.slug);
    if (!dest) notFound();
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                <DestinationDetailClient destination={dest} />
            </main>
            <Footer />
        </>
    );
}
