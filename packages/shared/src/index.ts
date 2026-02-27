export interface Destination {
  _id: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  heroImage: string;
  gallery: string[];
  shortDescription: string;
  longDescription: string;
  basePrice: number;
  duration: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  tags: string[];
  coordinates: { lat: number; lng: number };
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  rating: number;
  reviewCount: number;
  bestTimeToVisit: string;
  createdAt: string;
}

export interface Package {
  _id: string;
  destinationId: string;
  destination?: Destination;
  title: string;
  type: 'group' | 'fit' | 'honeymoon' | 'family';
  duration: number;
  basePrice: number;
  discountedPrice?: number;
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  addOns?: FITAddOn[];
  status: 'active' | 'inactive' | 'soldout';
  availableDates: string[];
  maxGroupSize: number;
  minGroupSize: number;
  images: string[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: ('breakfast' | 'lunch' | 'dinner')[];
  accommodation: string;
  transport?: string;
}

export interface FITAddOn {
  _id: string;
  destinationId: string;
  name: string;
  description: string;
  category: 'adventure' | 'food' | 'culture' | 'relaxation' | 'transport' | 'stay';
  pricePerPerson: number;
  duration: number; // in hours
  image: string;
  isAvailable: boolean;
  rating: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'user' | 'admin' | 'superadmin';
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dateOfBirth?: string;
  passportNumber?: string;
  passportExpiry?: string;
  emergencyContact?: { name: string; phone: string; relation: string };
  travelPreferences?: string[];
  totalBookings?: number;
  createdAt: string;
}

export interface Booking {
  _id: string;
  userId: string;
  user?: User;
  packageId: string;
  package?: Package;
  destinationId: string;
  destination?: Destination;
  fitAddOns: { addOn: FITAddOn; quantity: number }[];
  travelers: TravelerDetail[];
  totalDays: number;
  totalCost: number;
  basePackageCost: number;
  addOnsCost: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded' | 'failed';
  paymentId?: string;
  razorpayOrderId?: string;
  status: 'enquiry' | 'confirmed' | 'departed' | 'completed' | 'cancelled';
  travelDate: string;
  returnDate: string;
  contactDetails: { name: string; email: string; phone: string };
  specialRequests?: string;
  createdAt: string;
}

export interface TravelerDetail {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  idProofType: 'aadhar' | 'passport' | 'drivinglicense';
  idProofNumber: string;
}

export interface Lead {
  _id: string;
  userId?: string;
  user?: User;
  destinationId: string;
  destination?: Destination;
  packageId?: string;
  contactDetails: { name: string; email: string; phone: string };
  preferredDates?: string;
  groupSize: number;
  budget?: string;
  message?: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  notifiedAdmin: boolean;
  source: string;
  createdAt: string;
}

export interface Vendor {
  _id: string;
  name: string;
  type: 'hotel' | 'transport' | 'guide' | 'activity' | 'restaurant';
  destinationId: string;
  destination?: Destination;
  contactName: string;
  phone: string;
  email?: string;
  website?: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  rating: number;
  priceRange: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  notes?: string;
  source: 'manual' | 'google_maps' | 'partner';
  isVerified: boolean;
  createdAt: string;
}

export interface Review {
  _id: string;
  userId: string;
  user?: User;
  destinationId: string;
  bookingId?: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  isApproved: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
