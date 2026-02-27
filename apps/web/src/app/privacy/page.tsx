import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 min-h-screen bg-gray-50 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="card p-8 md:p-12 prose prose-gray max-w-none">
                        <h1 className="font-display text-3xl font-bold text-night-900 mb-6">Privacy Policy</h1>
                        <p className="text-gray-500 text-sm mb-8">Last Updated: October 2024</p>

                        <div className="space-y-6 text-gray-600">
                            <p>At GoTravel, your privacy is of utmost importance to us. This Privacy Policy outlines how we collect, use, and protect your personal information.</p>

                            <h2 className="text-xl font-bold text-night-900 mt-8 mb-4">1. Information We Collect</h2>
                            <p>We may collect personal identification information including name, email address, phone number, and payment details when you create an account, make a booking, or contact support.</p>

                            <h2 className="text-xl font-bold text-night-900 mt-8 mb-4">2. How We Use Your Information</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>To process and manage your travel bookings.</li>
                                <li>To communicate with you regarding your itinerary and updates.</li>
                                <li>To improve our Website and tailor the user experience.</li>
                                <li>To send promotional emails (only if you have opted in).</li>
                            </ul>

                            <h2 className="text-xl font-bold text-night-900 mt-8 mb-4">3. Data Sharing and Security</h2>
                            <p>We do not sell your personal data to third parties. Data is only shared with our trusted vendors (hotels, transport providers) strictly for the purpose of fulfilling your booking. We use industry-standard encryption to protect your data.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
