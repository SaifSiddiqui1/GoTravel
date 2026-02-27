import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';

const mockPosts = [
    {
        id: '1',
        slug: 'best-time-to-visit-kerala',
        title: 'The Ultimate Guide to Kerala\'s Backwaters: Best Time to Visit',
        excerpt: 'Discover the magic of God\'s Own Country. From the monsoon boat races to serene winter cruises, find out when you should plan your Kerala trip.',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000',
        date: 'Oct 15, 2024',
        author: 'Priya Sharma',
        category: 'Travel Guides'
    },
    {
        id: '2',
        slug: 'kashmir-winter-itinerary',
        title: 'A 7-Day Winter Wonderland Itinerary for Kashmir',
        excerpt: 'Experiencing snow-capped Gulmarg, cozy houseboats on Dal Lake, and the incredible Kashmiri wazwan cuisine in the peak of winter.',
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1000',
        date: 'Oct 12, 2024',
        author: 'Rahul Verma',
        category: 'Itineraries'
    },
    {
        id: '3',
        slug: 'rajasthan-forts-guide',
        title: 'Majestic Rajasthan: 5 Forts You Must Explore',
        excerpt: 'Step back into the era of maharajas. A detailed guide to exploring Jaipur\'s Amber Fort, Jodhpur\'s Mehrangarh, and more.',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1000',
        date: 'Oct 05, 2024',
        author: 'Anita Desai',
        category: 'Heritage'
    },
];

export const metadata = { title: 'Travel Blog & Guides | GoTravel', description: 'Read the latest travel guides, tips, and itineraries for exploring India.' };

export default function BlogListingPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 min-h-screen bg-gray-50 pb-20">
                <div className="bg-night-900 text-white py-20 px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Travel Inspiration & Guides</h1>
                        <p className="text-white/70 text-lg">Expert advice, hidden gems, and detailed itineraries to help you plan your next adventure across India.</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mockPosts.map(post => (
                            <article key={post.id} className="card overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                                <Link href={`/blog/${post.slug}`} className="block relative h-64 overflow-hidden">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-night-900">{post.category}</span>
                                </Link>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author}</span>
                                    </div>
                                    <h2 className="font-display text-xl font-bold text-night-900 mb-3 group-hover:text-brand-500 transition-colors">
                                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                    </h2>
                                    <p className="text-gray-600 mb-6 text-sm flex-1">{post.excerpt}</p>
                                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-600">
                                        Read Article <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <button className="btn-secondary px-8">Load More Articles</button>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
