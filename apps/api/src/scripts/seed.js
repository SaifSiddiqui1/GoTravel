require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const FITAddOn = require('../models/FITAddOn');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

const destinations = [
    {
        name: 'Kashmir',
        state: 'Jammu & Kashmir',
        country: 'India',
        heroImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200',
        gallery: ['https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800', 'https://images.unsplash.com/photo-1527838832700-5059252f4b84?w=800'],
        shortDescription: 'Paradise on Earth - Snow-capped mountains, serene dal lakes, and enchanting valleys await.',
        longDescription: 'Kashmir, often called Paradise on Earth, is a breathtaking destination in northern India...',
        basePrice: 16999,
        duration: 6,
        difficulty: 'easy',
        tags: ['mountains', 'lakes', 'snow', 'honeymoon', 'family', 'romantic'],
        coordinates: { lat: 34.0837, lng: 74.7973 },
        isFeatured: true,
        bestTimeToVisit: 'March to October',
        climate: 'Alpine',
        rating: 4.8,
        reviewCount: 2400,
        seoTitle: 'Kashmir Tour Packages 2024 | Book Kashmir Trip | GoTravel',
        seoDescription: 'Explore Kashmir with GoTravel. Best Kashmir tour packages starting ₹16,999. Book Gulmarg, Pahalgam, Dal Lake. FIT & group packages available.',
        seoKeywords: ['kashmir tour', 'kashmir trip', 'kashmir package', 'gulmarg', 'pahalgam', 'dal lake'],
        faqs: [
            { question: 'What is the best time to visit Kashmir?', answer: 'March to October is ideal. December-February for snow activities.' },
            { question: 'Is Kashmir safe to visit?', answer: 'Yes, tourist areas are safe. Millions visit annually.' },
        ],
    },
    {
        name: 'Manali',
        state: 'Himachal Pradesh',
        country: 'India',
        heroImage: 'https://images.unsplash.com/photo-1572106085780-11a91e3f6b43?w=1200',
        gallery: ['https://images.unsplash.com/photo-1572106085780-11a91e3f6b43?w=800'],
        shortDescription: 'Adventure capital of Himachal - bikes, snow, treks, and stunning Himalayan views.',
        longDescription: 'Manali is a high-altitude Himalayan resort town nestled in the mountains of Himachal Pradesh...',
        basePrice: 10999,
        duration: 5,
        difficulty: 'moderate',
        tags: ['adventure', 'mountains', 'bikes', 'snow', 'trekking', 'honeymoon'],
        coordinates: { lat: 32.2396, lng: 77.1887 },
        isFeatured: true,
        bestTimeToVisit: 'October to June',
        rating: 4.7,
        reviewCount: 3200,
        seoTitle: 'Manali Tour Packages | Book Manali Trip | GoTravel India',
        seoDescription: 'Book Manali tour packages from ₹10,999. Rohtang Pass, Solang Valley, Hadimba Temple. Best Manali packages with GoTravel.',
        seoKeywords: ['manali tour', 'manali trip', 'manali package', 'rohtang pass', 'solang valley'],
        faqs: [
            { question: 'How to reach Manali?', answer: 'By flight to Bhuntar airport (50km) or by Volvo bus from Delhi (14-15 hrs).' },
        ],
    },
    {
        name: 'Goa',
        state: 'Goa',
        country: 'India',
        heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200',
        gallery: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800'],
        shortDescription: 'Sun, sand, and soul - India\'s beach paradise with vibrant nightlife and Portuguese heritage.',
        longDescription: 'Goa, India\'s smallest state, is famous for its beaches, nightlife, and Portuguese-influenced heritage...',
        basePrice: 12999,
        duration: 4,
        difficulty: 'easy',
        tags: ['beach', 'nightlife', 'party', 'water sports', 'heritage', 'family'],
        coordinates: { lat: 15.2993, lng: 74.1240 },
        isFeatured: true,
        bestTimeToVisit: 'November to February',
        rating: 4.6,
        reviewCount: 5100,
        seoTitle: 'Goa Tour Packages | Cheap Goa Packages | GoTravel',
        seoDescription: 'Goa tour packages from ₹12,999. North Goa, South Goa, water sports, beach shacks. Book Goa trip with GoTravel.',
        seoKeywords: ['goa tour', 'goa trip', 'goa package', 'goa beach', 'goa nightlife'],
        faqs: [],
    },
    {
        name: 'Kerala',
        state: 'Kerala',
        country: 'India',
        heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200',
        gallery: [],
        shortDescription: 'God\'s Own Country - backwaters, ayurveda, hill stations, and pristine beaches.',
        longDescription: 'Kerala, known as God\'s Own Country, offers a unique blend of natural beauty and cultural richness...',
        basePrice: 14999,
        duration: 7,
        difficulty: 'easy',
        tags: ['backwaters', 'ayurveda', 'houseboat', 'family', 'honeymoon', 'nature'],
        coordinates: { lat: 10.8505, lng: 76.2711 },
        isFeatured: true,
        bestTimeToVisit: 'September to March',
        rating: 4.9,
        reviewCount: 4400,
        seoTitle: 'Kerala Tour Packages | Kerala Trip | GoTravel',
        seoDescription: 'Book Kerala tour packages from ₹14,999. Munnar, Alleppey backwaters, Kovalam beach, Thekkady. Best Kerala packages.',
        seoKeywords: ['kerala tour', 'kerala backwaters', 'alleppey houseboat', 'munnar'],
        faqs: [],
    },
    {
        name: 'Rajasthan',
        state: 'Rajasthan',
        country: 'India',
        heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200',
        gallery: [],
        shortDescription: 'Land of Kings - royal palaces, sand dunes, camel safaris, and vibrant culture.',
        longDescription: 'Rajasthan, the Land of Kings, is India\'s most colorful state with majestic palaces and golden deserts...',
        basePrice: 11999,
        duration: 8,
        difficulty: 'easy',
        tags: ['heritage', 'culture', 'desert', 'palaces', 'camel safari', 'family'],
        coordinates: { lat: 26.9124, lng: 75.7873 },
        isFeatured: true,
        bestTimeToVisit: 'October to March',
        rating: 4.7,
        reviewCount: 3800,
        seoTitle: 'Rajasthan Tour Packages | Book Rajasthan Trip | GoTravel',
        seoDescription: 'Explore royal Rajasthan with GoTravel. Jaipur, Udaipur, Jodhpur, Jaisalmer packages from ₹11,999.',
        seoKeywords: ['rajasthan tour', 'jaipur trip', 'udaipur honeymoon', 'jaisalmer desert'],
        faqs: [],
    },
    {
        name: 'Ladakh',
        state: 'Ladakh',
        country: 'India',
        heroImage: 'https://images.unsplash.com/photo-1604536573891-1cb4f4a95dbc?w=1200',
        gallery: [],
        shortDescription: 'Land of High Passes - moonscapes, monasteries, and the world\'s highest motorable roads.',
        longDescription: 'Ladakh is a region in northern India known for its remote mountain beauty and Buddhist culture...',
        basePrice: 22999,
        duration: 9,
        difficulty: 'hard',
        tags: ['adventure', 'mountains', 'bikes', 'monasteries', 'lakes', 'camping'],
        coordinates: { lat: 34.1526, lng: 77.5771 },
        isFeatured: false,
        bestTimeToVisit: 'June to September',
        rating: 4.9,
        reviewCount: 1900,
        seoTitle: 'Ladakh Tour Packages | Leh Ladakh Trip | GoTravel',
        seoDescription: 'Leh Ladakh tour packages from ₹22,999. Pangong Lake, Nubra Valley, Khardung La. Book Ladakh bike & car tours.',
        seoKeywords: ['ladakh tour', 'leh ladakh', 'pangong lake', 'ladakh bike trip'],
        faqs: [],
    },
];

const fitAddOnsTemplate = [
    { name: 'Shikara Ride on Dal Lake', category: 'relaxation', pricePerPerson: 800, duration: 2, image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600' },
    { name: 'Snow Skiing at Gulmarg', category: 'adventure', pricePerPerson: 2500, duration: 4, image: 'https://images.unsplash.com/photo-1548502090-f5a9e3c1ee71?w=600' },
    { name: 'Wazwan Traditional Dinner', category: 'food', pricePerPerson: 1200, duration: 2, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600' },
    { name: 'Gondola Cable Car Ride', category: 'adventure', pricePerPerson: 1500, duration: 2, image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600' },
    { name: 'Paragliding in Solang Valley', category: 'adventure', pricePerPerson: 3000, duration: 3, image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=600' },
    { name: 'River Rafting at Beas', category: 'adventure', pricePerPerson: 1800, duration: 3, image: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600' },
    { name: 'Rohtang Pass Day Trip', category: 'culture', pricePerPerson: 2000, duration: 8, image: 'https://images.unsplash.com/photo-1572106085780-11a91e3f6b43?w=600' },
    { name: 'Sunset Cruise on Alleppey Backwaters', category: 'relaxation', pricePerPerson: 1500, duration: 3, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600' },
    { name: 'Ayurvedic Massage & Spa', category: 'relaxation', pricePerPerson: 3500, duration: 4, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600' },
    { name: 'Camel Safari in Jaisalmer', category: 'adventure', pricePerPerson: 2500, duration: 4, image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600' },
    { name: 'Heritage Walk in Old Jaipur', category: 'culture', pricePerPerson: 900, duration: 3, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600' },
    { name: 'Beach Watersports Package', category: 'adventure', pricePerPerson: 2200, duration: 3, image: 'https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2?w=600' },
    { name: 'Scuba Diving in Goa', category: 'adventure', pricePerPerson: 4000, duration: 4, image: 'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=600' },
    { name: 'Pangong Lake Camping', category: 'adventure', pricePerPerson: 3500, duration: 24, image: 'https://images.unsplash.com/photo-1604536573891-1cb4f4a95dbc?w=600' },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing
        await Promise.all([
            Destination.deleteMany({}),
            Package.deleteMany({}),
            FITAddOn.deleteMany({}),
            User.deleteMany({ email: 'admin@gotravel.in' }),
        ]);

        // Seed destinations
        const createdDestinations = await Destination.insertMany(destinations);
        console.log(`✅ ${createdDestinations.length} destinations seeded`);

        // Seed FIT add-ons per destination
        const addOnDocs = [];
        for (const dest of createdDestinations) {
            const relevant = fitAddOnsTemplate.slice(0, 6).map(a => ({
                ...a,
                destinationId: dest._id,
                isAvailable: true,
                rating: (4 + Math.random()).toFixed(1),
                reviewCount: Math.floor(Math.random() * 200 + 50),
                description: `Experience the best of ${dest.name} with this ${a.name.toLowerCase()} activity. A must-do for every traveler!`,
                tags: [dest.name.toLowerCase(), a.category],
                highlights: ['Expert guides', 'Safety equipment provided', 'Memories for life'],
            }));
            addOnDocs.push(...relevant);
        }
        await FITAddOn.insertMany(addOnDocs);
        console.log(`✅ ${addOnDocs.length} FIT add-ons seeded`);

        // Seed packages
        const packageDocs = [];
        for (const dest of createdDestinations) {
            packageDocs.push({
                destinationId: dest._id,
                title: `${dest.name} Standard Group Tour`,
                type: 'group',
                duration: dest.duration,
                nights: dest.duration - 1,
                basePrice: dest.basePrice,
                discountedPrice: Math.round(dest.basePrice * 0.9),
                discountPercent: 10,
                status: 'active',
                maxGroupSize: 20,
                minGroupSize: 4,
                inclusions: ['Accommodation', 'Meals (as per itinerary)', 'Transfers', 'Sightseeing', 'Expert guide', 'Free ₹4.5L travel insurance'],
                exclusions: ['Airfare', 'Personal expenses', 'Optional activities', 'Tips'],
                highlights: ['Expert local guides', 'Handpicked stays', 'Small group experience', 'Authentic local food'],
                itinerary: Array.from({ length: dest.duration }, (_, i) => ({
                    day: i + 1,
                    title: i === 0 ? 'Arrival & Check-in' : i === dest.duration - 1 ? 'Departure' : `Day ${i + 1} Exploration`,
                    description: `Day ${i + 1} of your ${dest.name} adventure. Explore iconic attractions and soak in the local culture.`,
                    activities: ['Sightseeing', 'Local market visit', 'Photography walk'],
                    meals: ['breakfast', 'dinner'],
                    accommodation: `Premium hotel in ${dest.name}`,
                    transport: 'Private cab',
                })),
                cancellationPolicy: 'Free cancellation up to 30 days before travel. 50% refund up to 15 days. No refund within 14 days.',
                images: [dest.heroImage],
                availableDates: [],
                pricingTiers: { solo: dest.basePrice * 1.2, couple: dest.basePrice * 0.95, family: dest.basePrice * 0.85, group: dest.basePrice * 0.8 },
            });

            packageDocs.push({
                destinationId: dest._id,
                title: `${dest.name} FIT Custom Package`,
                type: 'fit',
                duration: dest.duration,
                nights: dest.duration - 1,
                basePrice: dest.basePrice * 1.1,
                status: 'active',
                maxGroupSize: 10,
                minGroupSize: 1,
                inclusions: ['Accommodation', 'Meals (as per itinerary)', 'Private transfers', 'Flexible itinerary', 'Expert guide'],
                exclusions: ['Airfare', 'Personal expenses', 'Add-on activities'],
                highlights: ['Fully customizable', 'Private vehicle', 'Choose your own pace', 'Add activities a-la-carte'],
                itinerary: Array.from({ length: dest.duration }, (_, i) => ({
                    day: i + 1,
                    title: i === 0 ? 'Arrival & Welcome' : `Day ${i + 1} - Your Choice`,
                    description: 'This is your FIT package — customize this day with activities from our add-ons list below!',
                    activities: ['Flexible - choose from FIT add-ons'],
                    meals: ['breakfast'],
                    accommodation: `Hotel/resort of your choice in ${dest.name}`,
                })),
                cancellationPolicy: 'Free cancellation up to 30 days. 50% within 15 days.',
                images: [dest.heroImage],
                availableDates: [],
                pricingTiers: { solo: dest.basePrice * 1.3, couple: dest.basePrice, family: dest.basePrice * 0.9, group: dest.basePrice * 0.85 },
            });
        }
        await Package.insertMany(packageDocs);
        console.log(`✅ ${packageDocs.length} packages seeded`);

        // Create admin user
        await User.create({
            name: 'GoTravel Admin',
            email: 'admin@gotravel.in',
            password: 'GoTravel@Admin2024',
            role: 'superadmin',
            isVerified: true,
        });
        console.log('✅ Admin user created: admin@gotravel.in / GoTravel@Admin2024');

        console.log('\n🎉 Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
