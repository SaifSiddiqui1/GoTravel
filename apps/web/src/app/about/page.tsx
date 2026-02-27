import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Users, Globe2, ShieldCheck, Heart } from 'lucide-react';

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 min-h-screen bg-gray-50 pb-20">

                {/* Header */}
                <section className="bg-night-900 text-white py-20 px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Redefining Travel in India</h1>
                        <p className="text-white/70 text-lg">We believe that every journey should be as unique as the traveler. GoTravel combines cutting-edge AI with deep local expertise to craft experiences you'll never forget.</p>
                    </div>
                </section>

                {/* Vision */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="font-display text-3xl font-bold text-night-900 mb-6">Our Vision</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">Founded in 2024, GoTravel started with a simple idea: booking a custom trip should be as easy as buying a plane ticket. Traditional travel agencies offer rigid packages, and DIY planning takes hundreds of hours.</p>
                        <p className="text-gray-600 leading-relaxed">Our FIT (Flexible Independent Traveler) builder and Gemini-powered AI suggestions empower you to build your dream itinerary in minutes, not weeks. From the snow-capped peaks of Kashmir to the backwaters of Kerala, we bring the best of India to your fingertips.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <img src="https://images.unsplash.com/photo-1524492412937-b28074d5d7da?q=80&w=1000" alt="India" className="rounded-2xl h-64 object-cover w-full" />
                        <img src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1000" alt="Travel" className="rounded-2xl h-64 object-cover w-full mt-8" />
                    </div>
                </section>

                {/* Values */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <h2 className="font-display text-3xl font-bold text-night-900 mb-10 text-center">Core Values</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { icon: Globe2, title: 'Authenticity', desc: 'We partner with local experts to provide genuine cultural experiences.' },
                            { icon: ShieldCheck, title: 'Trust', desc: 'Transparent pricing, secure payments, and verified vendors.' },
                            { icon: Users, title: 'Flexibility', desc: 'Your trip, your rules. Build itineraries that fit your style.' },
                            { icon: Heart, title: 'Passion', desc: 'We love travel as much as you do, and it shows in our service.' },
                        ].map((v, i) => (
                            <div key={i} className="card p-6 text-center">
                                <div className="w-12 h-12 rounded-xl bg-gradient-brand text-white flex items-center justify-center mx-auto mb-4"><v.icon className="w-6 h-6" /></div>
                                <h3 className="font-bold text-night-900 mb-2">{v.title}</h3>
                                <p className="text-sm text-gray-500">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
