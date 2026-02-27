import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 min-h-screen bg-gray-50 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="card p-8 md:p-12 prose prose-gray max-w-none">
                        <h1 className="font-display text-3xl font-bold text-night-900 mb-6">Terms of Service</h1>
                        <p className="text-gray-500 text-sm mb-8">Last Updated: October 2024</p>

                        <div className="space-y-6 text-gray-600">
                            <p>Welcome to GoTravel. By accessing our website and using our services, you agree to comply with and be bound by the following terms.</p>

                            <h2 className="text-xl font-bold text-night-900 mt-8 mb-4">1. Booking and Payments</h2>
                            <p>All bookings made through GoTravel are subject to availability. A booking is only confirmed once full payment or the required deposit has been received. All payments are securely processed via Razorpay.</p>

                            <h2 className="text-xl font-bold text-night-900 mt-8 mb-4">2. Cancellations and Refunds</h2>
                            <p>Cancellation policies vary by destination and package. Standard policy allows for free cancellation up to 30 days before the travel date, subject to a 5% processing fee. Cancellations made within 30 days are subject to strict penalties.</p>

                            <h2 className="text-xl font-bold text-night-900 mt-8 mb-4">3. FIT Packages</h2>
                            <p>FIT (Flexible Independent Traveler) packages are custom-built. Prices shown in the builder are dynamic and may change based on availability at the time of final confirmation.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
