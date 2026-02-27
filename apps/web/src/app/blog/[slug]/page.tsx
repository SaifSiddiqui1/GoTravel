import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';

export const metadata = { title: 'The Ultimate Guide to Kerala\'s Backwaters | GoTravel', description: 'Discover the magic of God\'s Own Country. From the monsoon boat races to serene winter cruises.' };

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    // In a real app, we would fetch post by slug here. Using mock data for demo.

    return (
        <>
            <Navbar />
            <main className="pt-24 min-h-screen bg-white">

                {/* Hero image and title */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-500 mb-6">
                        <ArrowLeft className="w-4 h-4" /> Back to Blog
                    </Link>

                    <div className="mb-8">
                        <span className="badge bg-brand-50 text-brand-600 mb-4 px-3 py-1">Travel Guides</span>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-night-900 leading-tight mb-6">The Ultimate Guide to Kerala's Backwaters: Best Time to Visit</h1>

                        <div className="flex items-center justify-between border-y border-gray-100 py-4">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-2"><img src="https://ui-avatars.com/api/?name=Priya+Sharma&background=FF6B35&color=fff" className="w-8 h-8 rounded-full" alt="Author" /> <span className="font-semibold text-night-900">Priya Sharma</span></span>
                                <span className="hidden sm:inline text-gray-300">•</span>
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Oct 15, 2024</span>
                                <span className="hidden sm:inline text-gray-300">•</span>
                                <span>8 min read</span>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"><Share2 className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-12">
                    <img src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2000" alt="Kerala Backwaters" className="w-full h-[50vh] min-h-[400px] object-cover rounded-3xl" />
                </div>

                {/* Content */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 prose prose-lg prose-brand">
                    <p className="lead text-xl text-gray-600 mb-8 font-medium">
                        Swaying palm trees, emerald-green waters, and the gentle lapping of waves against a traditional wooden houseboat—welcome to the backwaters of Kerala, a network of interconnected canals, lakes, and rivers that spans over 900 kilometers.
                    </p>

                    <h2>Winter (September to February): The Peak Season</h2>
                    <p>
                        The winter months are arguably the best time to visit Kerala. The monsoon has retreated, leaving the landscape lush and vibrant. The temperatures hover between a comfortable 23°C to 30°C, making it perfect for exploring Alleppey and Kumarakom.
                    </p>
                    <ul>
                        <li><strong>Ideal for:</strong> First-time visitors, honeymooners, and photography enthusiasts.</li>
                        <li><strong>What to expect:</strong> Clear skies, calm waters ideal for houseboat cruising, and festive energy during Christmas and New Year.</li>
                        <li><strong>Pro Tip:</strong> This is the busiest time of year. Ensure you book your houseboat and accommodations well in advance using GoTravel's FIT builder!</li>
                    </ul>

                    <div className="bg-brand-50 rounded-2xl p-6 my-8 border border-brand-100">
                        <h4 className="flex items-center gap-2 text-brand-700 m-0 mb-2">💡 Travel Expert Advice</h4>
                        <p className="m-0 text-sm text-gray-700">If you want to avoid the heaviest crowds while still enjoying fantastic weather, aim for the "shoulder weeks" in late September or early February.</p>
                    </div>

                    <h2>Monsoon (June to August): A Lush Retreat</h2>
                    <p>
                        While many tourists avoid the monsoon, the romantic traveler knows that Kerala during the rains is an absolute spectacle. The "Ayurvedic season" is in full swing, as the cool, damp climate is considered ideal for rejuvenation therapies.
                    </p>
                    <img src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000" alt="Monsoon in Kerala" className="rounded-2xl my-8 w-full" />

                    <h2>Summer (March to May): Off-Beat Exploration</h2>
                    <p>
                        Summer in Kerala can be quite hot and humid, but it's the perfect time to score incredible deals on luxury resorts and premium houseboats. To escape the midday heat, head up to the nearby hill stations like Munnar or Wayanad.
                    </p>

                    <hr className="my-12 border-gray-100" />

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50 p-8 rounded-3xl">
                        <div>
                            <h3 className="text-xl font-bold text-night-900 mb-2 mt-0">Ready to explore Kerala?</h3>
                            <p className="text-gray-600 mb-0">Use our AI-powered FIT builder to craft your perfect backwater itinerary.</p>
                        </div>
                        <Link href="/destinations/kerala" className="btn-primary shrink-0">Plan Kerala Trip</Link>
                    </div>
                </div>

            </main>
            <Footer />
        </>
    );
}
