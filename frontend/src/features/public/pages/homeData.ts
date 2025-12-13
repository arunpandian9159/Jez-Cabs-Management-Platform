import {
  Zap,
  Clock,
  Map,
  Shield,
  Search,
  CreditCard,
  Car,
  Star,
  Smartphone,
  Headphones,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  LucideIcon,
} from 'lucide-react';

// Types
export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export interface StepItem {
  icon: LucideIcon;
  title: string;
  description: string;
  number: string;
}

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface FleetOption {
  id: number;
  name: string;
  description: string;
  capacity: string;
  price: string;
  image: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface Stat {
  value: string;
  label: string;
}

// Services data
export const services: ServiceItem[] = [
  {
    icon: Zap,
    title: 'Instant Rides',
    description:
      'Book a cab in seconds and get picked up within minutes. Perfect for your immediate travel needs.',
    color: 'from-[#2563eb] to-[#1d4ed8]',
  },
  {
    icon: Clock,
    title: 'Flexible Rentals',
    description:
      'Rent cabs for hours, days, or weeks. Choose your duration and enjoy the freedom of hassle-free travel.',
    color: 'from-[#0d9488] to-[#0f766e]',
  },
  {
    icon: Map,
    title: 'Plan Your Trips',
    description:
      'Schedule rides in advance, plan multi-city tours, and customize your journey with complete flexibility.',
    color: 'from-[#3b82f6] to-[#0d9488]',
  },
  {
    icon: Shield,
    title: 'Safety First',
    description:
      'Complete transparency with verified drivers, real-time tracking, and 24/7 support for your peace of mind.',
    color: 'from-[#14b8a6] to-[#2563eb]',
  },
];

// How it works steps
export const steps: StepItem[] = [
  {
    icon: Search,
    title: 'Choose Your Service',
    description:
      'Select from instant rides, cab rentals, or trip planning based on your needs',
    number: '01',
  },
  {
    icon: CreditCard,
    title: 'Book & Pay Securely',
    description:
      'Complete your booking with transparent pricing and secure payment options',
    number: '02',
  },
  {
    icon: Car,
    title: 'Get Picked Up',
    description:
      'Track your driver in real-time and enjoy a comfortable, safe journey',
    number: '03',
  },
  {
    icon: Star,
    title: 'Rate Your Experience',
    description:
      'Share your feedback to help us maintain the highest service standards',
    number: '04',
  },
];

// Features data
export const features: FeatureItem[] = [
  {
    icon: Shield,
    title: 'Complete Safety',
    description:
      'All drivers verified with background checks and real-time tracking',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Book rides anytime, anywhere with round-the-clock service',
  },
  {
    icon: DollarSign,
    title: 'Transparent Pricing',
    description: 'No hidden charges. Know the exact fare before you book',
  },
  {
    icon: Smartphone,
    title: 'Easy Booking',
    description: 'User-friendly interface for quick and hassle-free bookings',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our support team is always ready to assist you',
  },
  {
    icon: Star,
    title: 'Quality Assurance',
    description: 'Highly rated drivers and well-maintained vehicles',
  },
];

// For Owners features
export const ownerFeatures: FeatureItem[] = [
  {
    icon: Car,
    title: 'Fleet Management',
    description: 'Add, manage, and track all your cabs from a single dashboard',
  },
  {
    icon: Users,
    title: 'Driver Management',
    description: 'Hire, assign, and monitor drivers with ease',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Get detailed insights on earnings, trips, and performance',
  },
  {
    icon: Settings,
    title: 'Complete Control',
    description: 'Set pricing, availability, and manage bookings in real-time',
  },
];

export const ownerBenefits: string[] = [
  'Maximize your fleet utilization',
  'Real-time driver tracking',
  'Automated payment processing',
  '24/7 booking management',
  'Verified driver network',
  'Instant notifications',
];

// Fleet Options
export const fleetOptions: FleetOption[] = [
  {
    id: 1,
    name: 'Economy',
    description: 'Budget-friendly rides for everyday travel',
    capacity: '4 Passengers',
    price: 'From $8/km',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
  },
  {
    id: 2,
    name: 'Premium',
    description: 'Comfortable sedans for business travel',
    capacity: '4 Passengers',
    price: 'From $12/km',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
  },
  {
    id: 3,
    name: 'SUV',
    description: 'Spacious rides for family trips',
    capacity: '6 Passengers',
    price: 'From $15/km',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
  },
  {
    id: 4,
    name: 'Luxury',
    description: 'Premium experience for special occasions',
    capacity: '4 Passengers',
    price: 'From $25/km',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400',
  },
];

// Testimonials
export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Business Traveler',
    content:
      'Jez Cabs has transformed my daily commute. The drivers are professional and the cars are always clean. Highly recommended!',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Frequent Traveler',
    content:
      'The booking process is seamless and the pricing is transparent. No more haggling with taxi drivers!',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Fleet Owner',
    content:
      'As a fleet owner, the dashboard helps me manage my vehicles efficiently. Great analytics and revenue tracking!',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  },
];

// Stats
export const stats: Stat[] = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '1000+', label: 'Verified Drivers' },
  { value: '100+', label: 'Cities Covered' },
  { value: '5M+', label: 'Trips Completed' },
];
