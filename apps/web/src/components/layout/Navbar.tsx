'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, Phone, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';

const navLinks = [
    { label: 'Destinations', href: '/destinations' },
    { label: 'FIT Packages', href: '/destinations?type=fit' },
    { label: 'Group Tours', href: '/destinations?type=group' },
    { label: 'Honeymoon', href: '/destinations?type=honeymoon' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('gt_token');
        const userStr = localStorage.getItem('gt_user');
        if (token && userStr) {
            try { setUser(JSON.parse(userStr)); } catch (_) { }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('gt_token');
        localStorage.removeItem('gt_user');
        setUser(null);
        setUserMenuOpen(false);
        window.location.href = '/';
    };

    const isTransparent = pathname === '/' && !scrolled;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent
                    ? 'bg-transparent'
                    : 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100'
                }`}
        >
            {/* Top bar */}
            <div className={`hidden lg:flex items-center justify-between px-6 py-2 text-sm transition-all duration-300 ${isTransparent ? 'text-white/80' : 'text-gray-600 bg-gray-50 border-b border-gray-100'}`}>
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> +91 98765 43210</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Mumbai, India</span>
                </div>
                <div className="flex items-center gap-4">
                    <span>✈️ Free ₹4.5L Travel Insurance on Every Booking</span>
                    <Link href="/contact" className="hover:text-brand-500 transition-colors font-medium">Get Free Quote</Link>
                </div>
            </div>

            {/* Main nav */}
            <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-bold text-lg shadow-brand">G</div>
                    <span className={`text-xl font-display font-bold transition-colors ${isTransparent ? 'text-white' : 'text-night-900'}`}>
                        Go<span className="text-brand-500">Travel</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isTransparent
                                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                                    : 'text-gray-600 hover:text-brand-500 hover:bg-brand-50'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* CTA + User */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                                    {user.name?.[0]?.toUpperCase()}
                                </div>
                                <span className="hidden sm:block">{user.name?.split(' ')[0]}</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-card-hover border border-gray-100 overflow-hidden"
                                    >
                                        <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"><LayoutDashboard className="w-4 h-4" /> My Trips</Link>
                                        <Link href="/dashboard/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"><User className="w-4 h-4" /> Profile</Link>
                                        <hr className="my-1" />
                                        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50"><LogOut className="w-4 h-4" /> Sign Out</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/login" className={`hidden sm:block px-4 py-2 rounded-xl text-sm font-medium transition-all ${isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:text-brand-500'}`}>
                                Sign In
                            </Link>
                            <Link href="/destinations" className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex">
                                ✈️ Book Now
                            </Link>
                        </>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`lg:hidden p-2 rounded-xl transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-gray-100"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-brand-50 hover:text-brand-600 font-medium transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-3 border-t border-gray-100 space-y-2">
                                {!user ? (
                                    <>
                                        <Link href="/auth/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">Sign In</Link>
                                        <Link href="/destinations" onClick={() => setIsOpen(false)} className="btn-primary w-full justify-center">Book Now</Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50">My Trips</Link>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50">Sign Out</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
