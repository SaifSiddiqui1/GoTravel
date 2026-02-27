import Link from 'next/link';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';

const footerLinks = {
    Destinations: [
        { label: 'Kashmir Tours', href: '/destinations/kashmir' },
        { label: 'Manali Packages', href: '/destinations/manali' },
        { label: 'Goa Holidays', href: '/destinations/goa' },
        { label: 'Kerala Tours', href: '/destinations/kerala' },
        { label: 'Rajasthan Package', href: '/destinations/rajasthan' },
        { label: 'All Destinations', href: '/destinations' },
    ],
    'Travel Types': [
        { label: 'Group Tours', href: '/destinations?type=group' },
        { label: 'FIT Packages', href: '/destinations?type=fit' },
        { label: 'Honeymoon', href: '/destinations?type=honeymoon' },
        { label: 'Family Tours', href: '/destinations?type=family' },
        { label: 'Adventure Trips', href: '/destinations?tags=adventure' },
        { label: 'Trekking', href: '/destinations?tags=trekking' },
    ],
    Company: [
        { label: 'About GoTravel', href: '/about' },
        { label: 'Blog & Travel Tips', href: '/blog' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Careers', href: '/careers' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-night-900 text-white">
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-bold text-lg">G</div>
                            <span className="text-xl font-display font-bold">Go<span className="text-brand-400">Travel</span></span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
                            India's premier travel company crafting unforgettable journeys since 2014. Over 50,000 happy travelers and counting.
                        </p>
                        <div className="space-y-3 text-sm text-white/60">
                            <a href="tel:+919876543210" className="flex items-center gap-3 hover:text-brand-400 transition-colors">
                                <Phone className="w-4 h-4" /> +91 98765 43210
                            </a>
                            <a href="mailto:hello@gotravel.in" className="flex items-center gap-3 hover:text-brand-400 transition-colors">
                                <Mail className="w-4 h-4" /> hello@gotravel.in
                            </a>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>Gotravel House, Bandra Kurla Complex, Mumbai 400051</span>
                            </div>
                        </div>
                        {/* Social */}
                        <div className="flex gap-3 mt-6">
                            {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-brand-500 transition-colors">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="font-semibold text-white mb-5">{title}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-sm text-white/60 hover:text-brand-400 transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-white/40 text-sm">© {new Date().getFullYear()} GoTravel. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <span className="text-white/20 text-sm">Registered: IATA · ATOL · MoT India</span>
                        <div className="flex gap-6 text-sm text-white/40">
                            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
                            <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy</Link>
                            <Link href="/sitemap.xml" className="hover:text-white/70 transition-colors">Sitemap</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
