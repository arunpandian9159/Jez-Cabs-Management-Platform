-- =====================================================
-- JEZ CABS PLATFORM - SUPABASE SQL SCHEMA
-- =====================================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- =====================================================
-- ENUMS
-- =====================================================
CREATE TYPE user_role AS ENUM ('customer', 'driver', 'cab_owner', 'trip_planner', 'admin', 'support');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending_verification', 'inactive');
CREATE TYPE driver_status AS ENUM ('available', 'busy', 'offline', 'on_trip');
CREATE TYPE cab_status AS ENUM ('available', 'on_trip', 'maintenance', 'inactive');
CREATE TYPE cab_type AS ENUM ('sedan', 'suv', 'hatchback', 'premium', 'electric', 'auto');
CREATE TYPE trip_status AS ENUM ('pending', 'accepted', 'driver_arriving', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('cash', 'upi', 'card', 'wallet');
CREATE TYPE dispute_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE dispute_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE rental_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled');
CREATE TYPE community_trip_type AS ENUM ('offering', 'requesting');
CREATE TYPE community_trip_status AS ENUM ('active', 'full', 'completed', 'cancelled');
-- =====================================================
-- USERS TABLE (All user types)
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    status user_status NOT NULL DEFAULT 'active',
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    phone_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
-- =====================================================
-- DRIVER PROFILES
-- =====================================================
CREATE TABLE driver_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50),
    license_expiry DATE,
    license_type VARCHAR(50),
    date_of_birth DATE,
    address TEXT,
    status driver_status DEFAULT 'offline',
    rating DECIMAL(3,2) DEFAULT 5.00,
    total_trips INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    current_location_lat DECIMAL(10,8),
    current_location_lng DECIMAL(11,8),
    is_online BOOLEAN DEFAULT FALSE,
    current_cab_id UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);
CREATE INDEX idx_driver_profiles_status ON driver_profiles(status);
CREATE INDEX idx_driver_profiles_location ON driver_profiles(current_location_lat, current_location_lng);
-- =====================================================
-- CAB OWNER PROFILES
-- =====================================================
CREATE TABLE cab_owner_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255),
    gst_number VARCHAR(50),
    pan_number VARCHAR(20),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    total_cabs INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);
-- =====================================================
-- CABS / VEHICLES
-- =====================================================
CREATE TABLE cabs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_driver_id UUID REFERENCES users(id),
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER,
    registration_number VARCHAR(50) NOT NULL,
    cab_type cab_type NOT NULL DEFAULT 'sedan',
    status cab_status DEFAULT 'inactive',
    color VARCHAR(50),
    seating_capacity INTEGER DEFAULT 4,
    fuel_type VARCHAR(50),
    ac_available BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    insurance_expiry DATE,
    registration_expiry DATE,
    fitness_expiry DATE,
    permit_expiry DATE,
    base_fare DECIMAL(10,2) DEFAULT 50,
    per_km_rate DECIMAL(10,2) DEFAULT 12,
    per_min_rate DECIMAL(10,2) DEFAULT 2,
    rating DECIMAL(3,2) DEFAULT 5.00,
    total_trips INTEGER DEFAULT 0,
    current_location_lat DECIMAL(10,8),
    current_location_lng DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_cabs_owner ON cabs(owner_id);
CREATE INDEX idx_cabs_status ON cabs(status);
CREATE INDEX idx_cabs_type ON cabs(cab_type);
CREATE INDEX idx_cabs_location ON cabs(current_location_lat, current_location_lng);
-- =====================================================
-- TRIPS / RIDES
-- =====================================================
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES users(id),
    driver_id UUID REFERENCES users(id),
    cab_id UUID REFERENCES cabs(id),
    pickup_address TEXT NOT NULL,
    pickup_lat DECIMAL(10,8) NOT NULL,
    pickup_lng DECIMAL(11,8) NOT NULL,
    dropoff_address TEXT NOT NULL,
    dropoff_lat DECIMAL(10,8) NOT NULL,
    dropoff_lng DECIMAL(11,8) NOT NULL,
    distance_km DECIMAL(10,2),
    duration_minutes INTEGER,
    estimated_fare DECIMAL(10,2),
    actual_fare DECIMAL(10,2),
    base_fare DECIMAL(10,2),
    distance_fare DECIMAL(10,2),
    time_fare DECIMAL(10,2),
    surge_multiplier DECIMAL(3,2) DEFAULT 1.00,
    tip_amount DECIMAL(10,2) DEFAULT 0,
    status trip_status DEFAULT 'pending',
    scheduled_at TIMESTAMP,
    accepted_at TIMESTAMP,
    driver_arrived_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    cancelled_by UUID,
    otp VARCHAR(6),
    customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
    driver_rating INTEGER CHECK (driver_rating >= 1 AND driver_rating <= 5),
    customer_feedback TEXT,
    driver_feedback TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_trips_customer ON trips(customer_id);
CREATE INDEX idx_trips_driver ON trips(driver_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_created ON trips(created_at);
-- =====================================================
-- CAB RENTALS (Self-drive / Long-term)
-- =====================================================
CREATE TABLE rentals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES users(id),
    cab_id UUID NOT NULL REFERENCES cabs(id),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    pickup_location TEXT,
    return_location TEXT,
    daily_rate DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2),
    deposit_amount DECIMAL(10,2),
    status rental_status DEFAULT 'pending',
    with_driver BOOLEAN DEFAULT FALSE,
    driver_id UUID REFERENCES users(id),
    km_limit_per_day INTEGER,
    extra_km_rate DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_rentals_customer ON rentals(customer_id);
CREATE INDEX idx_rentals_cab ON rentals(cab_id);
CREATE INDEX idx_rentals_status ON rentals(status);
-- =====================================================
-- PAYMENTS
-- =====================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id),
    rental_id UUID REFERENCES rentals(id),
    payer_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method NOT NULL,
    status payment_status DEFAULT 'pending',
    transaction_id VARCHAR(100),
    gateway_response JSONB,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_payments_trip ON payments(trip_id);
CREATE INDEX idx_payments_payer ON payments(payer_id);
CREATE INDEX idx_payments_status ON payments(status);
-- =====================================================
-- DRIVER EARNINGS / PAYOUTS
-- =====================================================
CREATE TABLE earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES users(id),
    trip_id UUID REFERENCES trips(id),
    amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 20.00,
    commission_amount DECIMAL(10,2),
    net_amount DECIMAL(10,2),
    type VARCHAR(50) DEFAULT 'trip', -- trip, bonus, incentive, tip
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_earnings_driver ON earnings(driver_id);
CREATE INDEX idx_earnings_created ON earnings(created_at);
-- =====================================================
-- DISPUTES
-- =====================================================
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    trip_id UUID REFERENCES trips(id),
    rental_id UUID REFERENCES rentals(id),
    raised_by UUID NOT NULL REFERENCES users(id),
    against_user UUID REFERENCES users(id),
    issue_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    priority dispute_priority DEFAULT 'medium',
    status dispute_status DEFAULT 'open',
    assigned_to UUID REFERENCES users(id),
    resolution TEXT,
    refund_amount DECIMAL(10,2),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_raised_by ON disputes(raised_by);
-- =====================================================
-- DISPUTE MESSAGES
-- =====================================================
CREATE TABLE dispute_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
-- =====================================================
-- EMERGENCY CONTACTS
-- =====================================================
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    relationship VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    notify_on_ride_start BOOLEAN DEFAULT FALSE,
    notify_on_ride_end BOOLEAN DEFAULT FALSE,
    notify_on_sos BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_emergency_contacts_user ON emergency_contacts(user_id);
-- =====================================================
-- COMMUNITY TRIPS (Trip Exchange)
-- =====================================================
CREATE TABLE community_trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poster_id UUID NOT NULL REFERENCES users(id),
    trip_type community_trip_type NOT NULL,
    from_location TEXT NOT NULL,
    from_lat DECIMAL(10,8),
    from_lng DECIMAL(11,8),
    to_location TEXT NOT NULL,
    to_lat DECIMAL(10,8),
    to_lng DECIMAL(11,8),
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    seats_available INTEGER DEFAULT 1,
    price_per_seat DECIMAL(10,2),
    description TEXT,
    status community_trip_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_community_trips_poster ON community_trips(poster_id);
CREATE INDEX idx_community_trips_date ON community_trips(departure_date);
CREATE INDEX idx_community_trips_status ON community_trips(status);
-- =====================================================
-- COMMUNITY TRIP BOOKINGS
-- =====================================================
CREATE TABLE community_trip_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_trip_id UUID NOT NULL REFERENCES community_trips(id) ON DELETE CASCADE,
    booker_id UUID NOT NULL REFERENCES users(id),
    seats_booked INTEGER DEFAULT 1,
    total_amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT NOW()
);
-- =====================================================
-- DOCUMENT VERIFICATION
-- =====================================================
CREATE TABLE document_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- license, rc, insurance, aadhaar, pan
    document_number VARCHAR(100),
    document_url TEXT,
    status verification_status DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT NOW(),
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_doc_verifications_user ON document_verifications(user_id);
CREATE INDEX idx_doc_verifications_status ON document_verifications(status);
-- =====================================================
-- NOTIFICATIONS
-- =====================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    type VARCHAR(50),
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
-- =====================================================
-- USER SETTINGS
-- =====================================================
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    push_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    ride_updates BOOLEAN DEFAULT TRUE,
    promotions BOOLEAN DEFAULT TRUE,
    sound_enabled BOOLEAN DEFAULT TRUE,
    vibration_enabled BOOLEAN DEFAULT TRUE,
    dark_mode BOOLEAN DEFAULT FALSE,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);
-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cab_owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- Basic policies (expand as needed)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);
-- =====================================================
-- INITIAL ADMIN USER
-- =====================================================
INSERT INTO users (email, first_name, last_name, phone, role, status, is_verified)
VALUES ('admin@jezcabs.com', 'Admin', 'User', '+919999999999', 'admin', 'active', true);