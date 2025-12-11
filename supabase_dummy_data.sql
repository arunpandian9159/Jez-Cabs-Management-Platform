-- =====================================================
-- JEZ CABS PLATFORM - DUMMY DATA FOR SUPABASE
-- =====================================================
-- Run this script AFTER running complete_setup.sql
-- This script inserts comprehensive dummy data for testing
-- =====================================================

-- =====================================================
-- 1. USERS (Customers, Drivers, Cab Owners, Admin, Support)
-- =====================================================

-- Admin User (already created in setup, updating password hash)
UPDATE users SET password_hash = '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc' 
WHERE email = 'admin@jezcabs.com';

-- Customers
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, avatar_url, role, status, is_verified, email_verified_at, phone_verified_at)
VALUES 
    ('c0000001-0000-0000-0000-000000000001', 'rahul.kumar@email.com', '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc', 'Rahul', 'Kumar', '+919876543210', NULL, 'customer', 'active', true, NOW(), NOW()),
    ('c0000001-0000-0000-0000-000000000002', 'priya.sharma@email.com', '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc', 'Priya', 'Sharma', '+919876543211', NULL, 'customer', 'active', true, NOW(), NOW()),
    ('c0000001-0000-0000-0000-000000000003', 'amit.verma@email.com', '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc', 'Amit', 'Verma', '+919876543212', NULL, 'customer', 'active', true, NOW(), NOW()),
    ('c0000001-0000-0000-0000-000000000004', 'sneha.patel@email.com', '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc', 'Sneha', 'Patel', '+919876543213', NULL, 'customer', 'active', true, NOW(), NOW()),
    ('c0000001-0000-0000-0000-000000000005', 'vivek.singh@email.com', '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc', 'Vivek', 'Singh', '+919876543214', NULL, 'customer', 'active', true, NOW(), NOW()),
    ('c0000001-0000-0000-0000-000000000006', 'ananya.reddy@email.com', '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc', 'Ananya', 'Reddy', '+919876543215', NULL, 'customer', 'pending_verification', false, NULL, NULL);

-- Drivers
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, avatar_url, role, status, is_verified, email_verified_at, phone_verified_at)
VALUES 
    ('d0000001-0000-0000-0000-000000000001', 'rajesh.kumar.driver@email.com', '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc', 'Rajesh', 'Kumar', '+919876543220', NULL, 'driver', 'active', true, NOW(), NOW()),
    ('d0000001-0000-0000-0000-000000000002', 'suresh.menon@email.com', '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc', 'Suresh', 'Menon', '+919876543221', NULL, 'driver', 'active', true, NOW(), NOW()),
    ('d0000001-0000-0000-0000-000000000003', 'mahesh.rao@email.com', '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc', 'Mahesh', 'Rao', '+919876543222', NULL, 'driver', 'active', true, NOW(), NOW()),
    ('d0000001-0000-0000-0000-000000000004', 'vikram.patil@email.com', '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc', 'Vikram', 'Patil', '+919876543223', NULL, 'driver', 'active', true, NOW(), NOW()),
    ('d0000001-0000-0000-0000-000000000005', 'ganesh.kumar@email.com', '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc', 'Ganesh', 'Kumar', '+919876543224', NULL, 'driver', 'pending_verification', false, NULL, NULL),
    ('d0000001-0000-0000-0000-000000000006', 'ramesh.sharma@email.com', '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc', 'Ramesh', 'Sharma', '+919876543225', NULL, 'driver', 'inactive', true, NOW(), NOW());

-- Cab Owners
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, avatar_url, role, status, is_verified, email_verified_at, phone_verified_at)
VALUES 
    ('o0000001-0000-0000-0000-000000000001', 'kumar.fleet@email.com', '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc', 'Sunil', 'Kumar', '+919876543230', NULL, 'cab_owner', 'active', true, NOW(), NOW()),
    ('o0000001-0000-0000-0000-000000000002', 'ravi.motors@email.com', '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc', 'Ravi', 'Motors', '+919876543231', NULL, 'cab_owner', 'pending_verification', false, NULL, NULL);

-- Support Staff
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, avatar_url, role, status, is_verified, email_verified_at, phone_verified_at)
VALUES 
    ('s0000001-0000-0000-0000-000000000001', 'support1@jezcabs.com', '$2b$10$rQZ5QzT5WqDCqVK4I.3o.eHJ5mY3Lq8KE4wU9vgC8Y.QZ5I3P9abc', 'Lakshmi', 'Devi', '+919876543240', NULL, 'support', 'active', true, NOW(), NOW());

-- =====================================================
-- 2. DRIVER PROFILES
-- =====================================================

INSERT INTO driver_profiles (id, user_id, license_number, license_expiry, license_type, date_of_birth, address, status, rating, total_trips, total_earnings, current_location_lat, current_location_lng, is_online, current_cab_id)
VALUES 
    ('dp000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'KA01-2020-0012345', '2027-06-15', 'LMV', '1985-03-15', '123, 4th Cross, Koramangala, Bangalore - 560034', 'available', 4.8, 1248, 385000.00, 12.9354, 77.6119, true, NULL),
    ('dp000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000002', 'KA05-2019-0067890', '2026-08-20', 'LMV', '1988-07-22', '456, 5th Main, Indiranagar, Bangalore - 560038', 'available', 4.6, 892, 425000.00, 12.9716, 77.6412, true, NULL),
    ('dp000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000003', 'KA09-2018-0034567', '2025-12-10', 'LMV', '1990-11-08', '789, 2nd Stage, HSR Layout, Bangalore - 560102', 'on_trip', 4.9, 567, 280000.00, 12.9121, 77.6446, true, NULL),
    ('dp000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000004', 'KA12-2021-0089012', '2028-03-25', 'LMV', '1992-05-30', '321, 6th Block, Jayanagar, Bangalore - 560082', 'busy', 4.7, 234, 120000.00, 12.9252, 77.5835, true, NULL),
    ('dp000001-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000005', 'KA03-2022-0045678', '2029-01-05', 'LMV', '1995-09-12', '654, 8th Main, Marathahalli, Bangalore - 560037', 'offline', 0.00, 0, 0.00, NULL, NULL, false, NULL),
    ('dp000001-0000-0000-0000-000000000006', 'd0000001-0000-0000-0000-000000000006', 'KA07-2017-0023456', '2024-11-30', 'LMV', '1982-12-25', '987, 3rd Cross, Bellandur, Bangalore - 560103', 'offline', 4.5, 189, 95000.00, NULL, NULL, false, NULL);

-- =====================================================
-- 3. CAB OWNER PROFILES
-- =====================================================

INSERT INTO cab_owner_profiles (id, user_id, business_name, gst_number, pan_number, bank_account_number, bank_ifsc, total_cabs, total_earnings)
VALUES 
    ('cop00001-0000-0000-0000-000000000001', 'o0000001-0000-0000-0000-000000000001', 'Kumar Fleet Services', 'GST29ABCDE1234F1Z5', 'ABCDE1234F', '1234567890123456', 'HDFC0001234', 5, 2850000.00),
    ('cop00001-0000-0000-0000-000000000002', 'o0000001-0000-0000-0000-000000000002', 'Ravi Motors Pvt Ltd', 'GST29FGHIJ5678G2H6', 'FGHIJ5678G', '9876543210987654', 'ICIC0005678', 0, 0.00);

-- =====================================================
-- 4. CABS / VEHICLES
-- =====================================================

INSERT INTO cabs (id, owner_id, assigned_driver_id, make, model, year, registration_number, cab_type, status, color, seating_capacity, fuel_type, ac_available, insurance_expiry, registration_expiry, fitness_expiry, permit_expiry, base_fare, per_km_rate, per_min_rate, rating, total_trips, current_location_lat, current_location_lng)
VALUES 
    ('cab00001-0000-0000-0000-000000000001', 'o0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'Maruti', 'Swift Dzire', 2023, 'KA 01 AB 1234', 'sedan', 'available', 'White', 4, 'Petrol', true, '2025-06-20', '2026-03-15', '2025-08-10', '2025-01-10', 50.00, 12.00, 2.00, 4.8, 1248, 12.9354, 77.6119),
    ('cab00001-0000-0000-0000-000000000002', 'o0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000002', 'Hyundai', 'Creta', 2022, 'KA 01 CD 5678', 'suv', 'available', 'Black', 5, 'Diesel', true, '2025-09-15', '2025-08-20', '2025-10-05', '2026-02-28', 80.00, 16.00, 3.00, 4.9, 892, 12.9716, 77.6412),
    ('cab00001-0000-0000-0000-000000000003', 'o0000001-0000-0000-0000-000000000001', NULL, 'Toyota', 'Innova Crysta', 2023, 'KA 05 EF 9012', 'premium', 'maintenance', 'Silver', 7, 'Diesel', true, '2025-12-01', '2026-05-10', '2025-11-20', '2026-04-15', 100.00, 20.00, 4.00, 4.7, 567, NULL, NULL),
    ('cab00001-0000-0000-0000-000000000004', 'o0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000003', 'Honda', 'City', 2023, 'KA 09 GH 3456', 'sedan', 'on_trip', 'Gray', 4, 'Petrol', true, '2025-07-30', '2026-01-15', '2025-09-25', '2025-11-20', 60.00, 14.00, 2.50, 4.6, 234, 12.9121, 77.6446),
    ('cab00001-0000-0000-0000-000000000005', 'o0000001-0000-0000-0000-000000000001', NULL, 'Maruti', 'Ertiga', 2022, 'KA 12 IJ 7890', 'suv', 'inactive', 'Red', 7, 'CNG', true, '2025-04-10', '2025-09-25', '2025-05-15', '2025-08-30', 70.00, 14.00, 2.50, 4.5, 189, NULL, NULL);

-- Update driver profiles with assigned cab IDs
UPDATE driver_profiles SET current_cab_id = 'cab00001-0000-0000-0000-000000000001' WHERE user_id = 'd0000001-0000-0000-0000-000000000001';
UPDATE driver_profiles SET current_cab_id = 'cab00001-0000-0000-0000-000000000002' WHERE user_id = 'd0000001-0000-0000-0000-000000000002';
UPDATE driver_profiles SET current_cab_id = 'cab00001-0000-0000-0000-000000000004' WHERE user_id = 'd0000001-0000-0000-0000-000000000003';

-- =====================================================
-- 5. TRIPS / RIDES
-- =====================================================

INSERT INTO trips (id, customer_id, driver_id, cab_id, pickup_address, pickup_lat, pickup_lng, dropoff_address, dropoff_lat, dropoff_lng, distance_km, duration_minutes, estimated_fare, actual_fare, base_fare, distance_fare, time_fare, surge_multiplier, tip_amount, status, scheduled_at, accepted_at, driver_arrived_at, started_at, completed_at, cancelled_at, cancellation_reason, cancelled_by, otp, customer_rating, driver_rating, customer_feedback, driver_feedback)
VALUES 
    -- Completed trips
    ('trip0001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'cab00001-0000-0000-0000-000000000001', 'Koramangala 4th Block, Bangalore', 12.9354, 77.6119, 'Whitefield Tech Park, Bangalore', 12.9698, 77.7500, 15.20, 45, 350.00, 320.00, 50.00, 182.40, 90.00, 1.00, 0.00, 'completed', NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '5 minutes', NOW() - INTERVAL '2 days' + INTERVAL '10 minutes', NOW() - INTERVAL '2 days' + INTERVAL '55 minutes', NULL, NULL, NULL, '123456', 5, 5, 'Great driver, smooth ride!', 'Polite customer'),
    
    ('trip0001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000002', 'cab00001-0000-0000-0000-000000000002', 'Indiranagar 100ft Road, Bangalore', 12.9716, 77.6412, 'Electronic City Phase 1, Bangalore', 12.8458, 77.6631, 22.50, 62, 480.00, 450.00, 80.00, 360.00, 186.00, 1.00, 20.00, 'completed', NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '3 minutes', NOW() - INTERVAL '3 days' + INTERVAL '8 minutes', NOW() - INTERVAL '3 days' + INTERVAL '70 minutes', NULL, NULL, NULL, '234567', 4, 5, 'Good ride', 'Nice customer'),
    
    ('trip0001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000003', 'cab00001-0000-0000-0000-000000000004', 'MG Road Metro Station, Bangalore', 12.9756, 77.6065, 'Kempegowda International Airport, Bangalore', 13.1986, 77.7066, 45.00, 75, 900.00, 850.00, 60.00, 630.00, 187.50, 1.00, 50.00, 'completed', NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '4 minutes', NOW() - INTERVAL '1 day' + INTERVAL '12 minutes', NOW() - INTERVAL '1 day' + INTERVAL '87 minutes', NULL, NULL, NULL, '345678', 5, 4, 'Excellent service!', 'Good trip'),
    
    ('trip0001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000001', 'cab00001-0000-0000-0000-000000000001', 'HSR Layout Sector 2, Bangalore', 12.9121, 77.6446, 'Marathahalli Bridge, Bangalore', 12.9591, 77.6974, 8.50, 25, 180.00, 165.00, 50.00, 102.00, 50.00, 1.00, 0.00, 'completed', NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days' + INTERVAL '2 minutes', NOW() - INTERVAL '4 days' + INTERVAL '6 minutes', NOW() - INTERVAL '4 days' + INTERVAL '31 minutes', NULL, NULL, NULL, '456789', 4, 5, NULL, NULL),
    
    ('trip0001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000002', 'cab00001-0000-0000-0000-000000000002', 'Jayanagar 4th Block, Bangalore', 12.9279, 77.5835, 'Mysore (Outstation)', 12.2958, 76.6394, 145.00, 180, 3000.00, 2800.00, 80.00, 2320.00, 540.00, 1.00, 100.00, 'completed', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days' + INTERVAL '10 minutes', NOW() - INTERVAL '6 days' + INTERVAL '25 minutes', NOW() - INTERVAL '6 days' + INTERVAL '205 minutes', NULL, NULL, NULL, '567890', 5, 5, 'Best outstation experience!', 'Wonderful trip'),
    
    -- Cancelled trip
    ('trip0001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000005', NULL, NULL, 'BTM Layout 2nd Stage, Bangalore', 12.9166, 77.6101, 'Silk Board Junction, Bangalore', 12.9173, 77.6234, 3.00, 15, 100.00, 0.00, 50.00, 36.00, 30.00, 1.00, 0.00, 'cancelled', NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '5 days', 'No drivers available in the area', 'c0000001-0000-0000-0000-000000000005', NULL, NULL, NULL, NULL, NULL),
    
    -- In-progress trip
    ('trip0001-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000003', 'cab00001-0000-0000-0000-000000000004', 'Hebbal Flyover, Bangalore', 13.0358, 77.5970, 'Yelahanka New Town, Bangalore', 13.1007, 77.5963, 10.00, 30, 220.00, NULL, 60.00, 140.00, 75.00, 1.00, 0.00, 'in_progress', NULL, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '25 minutes', NOW() - INTERVAL '20 minutes', NULL, NULL, NULL, NULL, '678901', NULL, NULL, NULL, NULL),
    
    -- Pending/Accepted trip
    ('trip0001-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000004', 'cab00001-0000-0000-0000-000000000004', 'Bellandur Lake, Bangalore', 12.9259, 77.6736, 'Sarjapur Road, Bangalore', 12.9098, 77.6855, 5.00, 18, 130.00, NULL, 60.00, 70.00, 45.00, 1.00, 0.00, 'driver_arriving', NULL, NOW() - INTERVAL '5 minutes', NULL, NULL, NULL, NULL, NULL, NULL, '789012', NULL, NULL, NULL, NULL);

-- =====================================================
-- 6. RENTALS
-- =====================================================

INSERT INTO rentals (id, customer_id, cab_id, start_date, end_date, pickup_location, return_location, daily_rate, total_amount, deposit_amount, status, with_driver, driver_id, km_limit_per_day, extra_km_rate)
VALUES 
    ('rent0001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'cab00001-0000-0000-0000-000000000002', NOW() - INTERVAL '7 days', NOW(), 'Koramangala, Bangalore', 'Koramangala, Bangalore', 1250.00, 8750.00, 5000.00, 'completed', false, NULL, 200, 15.00),
    ('rent0001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'cab00001-0000-0000-0000-000000000003', NOW() + INTERVAL '5 days', NOW() + INTERVAL '12 days', 'Indiranagar, Bangalore', 'Indiranagar, Bangalore', 2500.00, 17500.00, 10000.00, 'confirmed', true, 'd0000001-0000-0000-0000-000000000004', 300, 18.00),
    ('rent0001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000004', 'cab00001-0000-0000-0000-000000000005', NOW() - INTERVAL '3 days', NOW() + INTERVAL '4 days', 'HSR Layout, Bangalore', 'Electronic City, Bangalore', 1000.00, 7000.00, 3000.00, 'active', false, NULL, 150, 12.00),
    ('rent0001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000005', 'cab00001-0000-0000-0000-000000000001', NOW() + INTERVAL '2 days', NOW() + INTERVAL '5 days', 'Whitefield, Bangalore', 'Whitefield, Bangalore', 1100.00, 3300.00, 2000.00, 'pending', false, NULL, 180, 14.00);

-- =====================================================
-- 7. PAYMENTS
-- =====================================================

INSERT INTO payments (id, trip_id, rental_id, payer_id, amount, payment_method, status, transaction_id, paid_at)
VALUES 
    ('pay00001-0000-0000-0000-000000000001', 'trip0001-0000-0000-0000-000000000001', NULL, 'c0000001-0000-0000-0000-000000000001', 320.00, 'card', 'completed', 'TXN_ABC123456789', NOW() - INTERVAL '2 days'),
    ('pay00001-0000-0000-0000-000000000002', 'trip0001-0000-0000-0000-000000000002', NULL, 'c0000001-0000-0000-0000-000000000002', 470.00, 'upi', 'completed', 'TXN_DEF234567890', NOW() - INTERVAL '3 days'),
    ('pay00001-0000-0000-0000-000000000003', 'trip0001-0000-0000-0000-000000000003', NULL, 'c0000001-0000-0000-0000-000000000003', 900.00, 'card', 'completed', 'TXN_GHI345678901', NOW() - INTERVAL '1 day'),
    ('pay00001-0000-0000-0000-000000000004', 'trip0001-0000-0000-0000-000000000004', NULL, 'c0000001-0000-0000-0000-000000000004', 165.00, 'cash', 'completed', NULL, NOW() - INTERVAL '4 days'),
    ('pay00001-0000-0000-0000-000000000005', 'trip0001-0000-0000-0000-000000000005', NULL, 'c0000001-0000-0000-0000-000000000001', 2900.00, 'card', 'completed', 'TXN_JKL456789012', NOW() - INTERVAL '6 days'),
    ('pay00001-0000-0000-0000-000000000006', NULL, 'rent0001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 8750.00, 'card', 'completed', 'TXN_MNO567890123', NOW() - INTERVAL '7 days'),
    ('pay00001-0000-0000-0000-000000000007', NULL, 'rent0001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000004', 3500.00, 'upi', 'completed', 'TXN_PQR678901234', NOW() - INTERVAL '3 days'),
    ('pay00001-0000-0000-0000-000000000008', NULL, 'rent0001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000004', 3500.00, 'upi', 'pending', NULL, NULL);

-- =====================================================
-- 8. DRIVER EARNINGS
-- =====================================================

INSERT INTO earnings (id, driver_id, trip_id, amount, commission_rate, commission_amount, net_amount, type)
VALUES 
    ('earn0001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'trip0001-0000-0000-0000-000000000001', 320.00, 20.00, 64.00, 256.00, 'trip'),
    ('earn0001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000002', 'trip0001-0000-0000-0000-000000000002', 450.00, 20.00, 90.00, 360.00, 'trip'),
    ('earn0001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000003', 'trip0001-0000-0000-0000-000000000003', 850.00, 20.00, 170.00, 680.00, 'trip'),
    ('earn0001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000001', 'trip0001-0000-0000-0000-000000000004', 165.00, 20.00, 33.00, 132.00, 'trip'),
    ('earn0001-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000002', 'trip0001-0000-0000-0000-000000000005', 2800.00, 20.00, 560.00, 2240.00, 'trip'),
    ('earn0001-0000-0000-0000-000000000006', 'd0000001-0000-0000-0000-000000000001', NULL, 500.00, 0.00, 0.00, 500.00, 'bonus'),
    ('earn0001-0000-0000-0000-000000000007', 'd0000001-0000-0000-0000-000000000002', NULL, 300.00, 0.00, 0.00, 300.00, 'incentive'),
    ('earn0001-0000-0000-0000-000000000008', 'd0000001-0000-0000-0000-000000000001', 'trip0001-0000-0000-0000-000000000005', 100.00, 0.00, 0.00, 100.00, 'tip');

-- =====================================================
-- 9. DISPUTES
-- =====================================================

INSERT INTO disputes (id, ticket_number, trip_id, rental_id, raised_by, against_user, issue_type, description, priority, status, assigned_to, resolution, refund_amount, resolved_at)
VALUES 
    ('disp0001-0000-0000-0000-000000000001', 'JEZ-DIS-2025-0001', 'trip0001-0000-0000-0000-000000000001', NULL, 'c0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'fare_dispute', 'The fare charged was higher than the estimated fare shown in the app.', 'high', 'resolved', 's0000001-0000-0000-0000-000000000001', 'After review, ₹30 difference was due to traffic surge. Partial refund processed.', 30.00, NOW() - INTERVAL '1 day'),
    ('disp0001-0000-0000-0000-000000000002', 'JEZ-DIS-2025-0002', 'trip0001-0000-0000-0000-000000000004', NULL, 'c0000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000001', 'driver_behavior', 'Driver was using phone while driving. Felt unsafe during the trip.', 'medium', 'in_progress', 's0000001-0000-0000-0000-000000000001', NULL, NULL, NULL),
    ('disp0001-0000-0000-0000-000000000003', 'JEZ-DIS-2025-0003', 'trip0001-0000-0000-0000-000000000006', NULL, 'c0000001-0000-0000-0000-000000000005', NULL, 'cancellation_issue', 'Trip was cancelled due to no drivers available, but cancellation fee was charged.', 'low', 'open', NULL, NULL, NULL, NULL);

-- =====================================================
-- 10. DISPUTE MESSAGES
-- =====================================================

INSERT INTO dispute_messages (id, dispute_id, sender_id, message)
VALUES 
    ('dmsg0001-0000-0000-0000-000000000001', 'disp0001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Hi, I noticed the fare was ₹30 more than what was shown. Can you please check?'),
    ('dmsg0001-0000-0000-0000-000000000002', 'disp0001-0000-0000-0000-000000000001', 's0000001-0000-0000-0000-000000000001', 'Thank you for reaching out. We are reviewing your trip details.'),
    ('dmsg0001-0000-0000-0000-000000000003', 'disp0001-0000-0000-0000-000000000001', 's0000001-0000-0000-0000-000000000001', 'We have processed a refund of ₹30 to your account. The difference was due to traffic surge pricing.'),
    ('dmsg0001-0000-0000-0000-000000000004', 'disp0001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000004', 'The driver was constantly on phone during the ride. Very unsafe.'),
    ('dmsg0001-0000-0000-0000-000000000005', 'disp0001-0000-0000-0000-000000000002', 's0000001-0000-0000-0000-000000000001', 'We take safety very seriously. We are investigating this matter and will take appropriate action.');

-- =====================================================
-- 11. EMERGENCY CONTACTS
-- =====================================================

INSERT INTO emergency_contacts (id, user_id, name, phone, relationship, is_primary, notify_on_ride_start, notify_on_ride_end, notify_on_sos)
VALUES 
    ('emrg0001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Sunita Kumar', '+919876543250', 'Wife', true, true, true, true),
    ('emrg0001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'Ravi Kumar', '+919876543251', 'Brother', false, false, false, true),
    ('emrg0001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000002', 'Anil Sharma', '+919876543252', 'Father', true, true, true, true),
    ('emrg0001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000003', 'Priya Verma', '+919876543253', 'Wife', true, false, true, true),
    ('emrg0001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000004', 'Raj Patel', '+919876543254', 'Husband', true, true, false, true);

-- =====================================================
-- 12. COMMUNITY TRIPS (Trip Exchange)
-- =====================================================

INSERT INTO community_trips (id, poster_id, trip_type, from_location, from_lat, from_lng, to_location, to_lat, to_lng, departure_date, departure_time, seats_available, price_per_seat, description, status)
VALUES 
    ('comtrip1-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'offering', 'Koramangala, Bangalore', 12.9354, 77.6119, 'Whitefield Tech Park, Bangalore', 12.9698, 77.7500, CURRENT_DATE + 1, '09:00', 2, 150.00, 'Daily office commute. Pickup from Sony Signal. AC car.', 'active'),
    ('comtrip1-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'offering', 'Indiranagar, Bangalore', 12.9716, 77.6412, 'Electronic City Phase 1, Bangalore', 12.8458, 77.6631, CURRENT_DATE + 1, '08:30', 3, 120.00, 'Morning commute with AC. Can pick up from 100ft Road area.', 'active'),
    ('comtrip1-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000003', 'requesting', 'HSR Layout, Bangalore', 12.9121, 77.6446, 'MG Road, Bangalore', 12.9756, 77.6065, CURRENT_DATE + 1, '10:00', 1, 100.00, 'Looking for a ride for a meeting. Flexible on time.', 'active'),
    ('comtrip1-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000004', 'offering', 'Marathahalli, Bangalore', 12.9591, 77.6974, 'Majestic Bus Stand, Bangalore', 12.9770, 77.5724, CURRENT_DATE + 2, '07:30', 4, 80.00, 'Weekend trip to city center. Comfortable Innova.', 'active'),
    ('comtrip1-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000001', 'offering', 'Bangalore', 12.9716, 77.5946, 'Mysore', 12.2958, 76.6394, CURRENT_DATE + 7, '06:00', 3, 400.00, 'Weekend trip to Mysore. Leaving early morning.', 'active');

-- =====================================================
-- 13. COMMUNITY TRIP BOOKINGS
-- =====================================================

INSERT INTO community_trip_bookings (id, community_trip_id, booker_id, seats_booked, total_amount, status)
VALUES 
    ('ctbook01-0000-0000-0000-000000000001', 'comtrip1-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 1, 150.00, 'confirmed'),
    ('ctbook01-0000-0000-0000-000000000002', 'comtrip1-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000004', 2, 240.00, 'confirmed'),
    ('ctbook01-0000-0000-0000-000000000003', 'comtrip1-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000005', 2, 800.00, 'confirmed');

-- =====================================================
-- 14. DOCUMENT VERIFICATIONS
-- =====================================================

INSERT INTO document_verifications (id, user_id, document_type, document_number, document_url, status, submitted_at, verified_at, verified_by, rejection_reason)
VALUES 
    -- Approved driver documents
    ('docver01-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'license', 'KA01-2020-0012345', '/uploads/documents/driver1_license.pdf', 'approved', NOW() - INTERVAL '90 days', NOW() - INTERVAL '88 days', (SELECT id FROM users WHERE email = 'admin@jezcabs.com'), NULL),
    ('docver01-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000001', 'aadhaar', '1234-5678-9012', '/uploads/documents/driver1_aadhaar.pdf', 'approved', NOW() - INTERVAL '90 days', NOW() - INTERVAL '88 days', (SELECT id FROM users WHERE email = 'admin@jezcabs.com'), NULL),
    ('docver01-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000002', 'license', 'KA05-2019-0067890', '/uploads/documents/driver2_license.pdf', 'approved', NOW() - INTERVAL '60 days', NOW() - INTERVAL '58 days', (SELECT id FROM users WHERE email = 'admin@jezcabs.com'), NULL),
    ('docver01-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000002', 'aadhaar', '2345-6789-0123', '/uploads/documents/driver2_aadhaar.pdf', 'approved', NOW() - INTERVAL '60 days', NOW() - INTERVAL '58 days', (SELECT id FROM users WHERE email = 'admin@jezcabs.com'), NULL),
    
    -- Pending driver documents
    ('docver01-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000005', 'license', 'KA03-2022-0045678', '/uploads/documents/driver5_license.pdf', 'pending', NOW() - INTERVAL '2 hours', NULL, NULL, NULL),
    ('docver01-0000-0000-0000-000000000006', 'd0000001-0000-0000-0000-000000000005', 'aadhaar', '3456-7890-1234', '/uploads/documents/driver5_aadhaar.pdf', 'pending', NOW() - INTERVAL '2 hours', NULL, NULL, NULL),
    
    -- Cab owner documents
    ('docver01-0000-0000-0000-000000000007', 'o0000001-0000-0000-0000-000000000001', 'pan', 'ABCDE1234F', '/uploads/documents/owner1_pan.pdf', 'approved', NOW() - INTERVAL '120 days', NOW() - INTERVAL '118 days', (SELECT id FROM users WHERE email = 'admin@jezcabs.com'), NULL),
    ('docver01-0000-0000-0000-000000000008', 'o0000001-0000-0000-0000-000000000002', 'insurance', 'INS-2024-789012', '/uploads/documents/owner2_insurance.pdf', 'pending', NOW() - INTERVAL '5 hours', NULL, NULL, NULL);

-- =====================================================
-- 15. NOTIFICATIONS
-- =====================================================

INSERT INTO notifications (id, user_id, title, body, type, data, is_read)
VALUES 
    ('notif001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Ride Completed', 'Your ride to Whitefield Tech Park has been completed. Total fare: ₹320', 'trip_completed', '{"trip_id": "trip0001-0000-0000-0000-000000000001", "fare": 320}', true),
    ('notif001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'Refund Processed', 'Your refund of ₹30 has been credited to your account.', 'refund', '{"dispute_id": "disp0001-0000-0000-0000-000000000001", "amount": 30}', true),
    ('notif001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000001', 'New Trip Request', 'You have a new trip request from Koramangala to Whitefield.', 'trip_request', '{"pickup": "Koramangala", "destination": "Whitefield"}', true),
    ('notif001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000001', 'Weekly Earnings Summary', 'You earned ₹18,500 this week from 42 trips. Great work!', 'earnings_summary', '{"amount": 18500, "trips": 42}', false),
    ('notif001-0000-0000-0000-000000000005', 'o0000001-0000-0000-0000-000000000001', 'Maintenance Due', 'Vehicle KA 05 EF 9012 is due for scheduled maintenance.', 'maintenance', '{"cab_id": "cab00001-0000-0000-0000-000000000003", "registration": "KA 05 EF 9012"}', false),
    ('notif001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000002', 'Community Trip Booking Confirmed', 'Your booking for the trip from Indiranagar to Electronic City has been confirmed.', 'community_trip', '{"trip_id": "comtrip1-0000-0000-0000-000000000002", "seats": 2}', true),
    ('notif001-0000-0000-0000-000000000007', 's0000001-0000-0000-0000-000000000001', 'New Dispute Assigned', 'A new dispute #JEZ-DIS-2025-0002 has been assigned to you.', 'dispute', '{"dispute_id": "disp0001-0000-0000-0000-000000000002"}', false);

-- =====================================================
-- 16. USER SETTINGS
-- =====================================================

INSERT INTO user_settings (id, user_id, push_notifications, email_notifications, sms_notifications, ride_updates, promotions, sound_enabled, vibration_enabled, dark_mode, language)
VALUES 
    ('usrset01-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', true, true, true, true, true, true, true, false, 'en'),
    ('usrset01-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', true, true, false, true, false, true, true, true, 'en'),
    ('usrset01-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000003', true, false, true, true, true, false, true, false, 'hi'),
    ('usrset01-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000001', true, true, true, true, false, true, true, false, 'en'),
    ('usrset01-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000002', true, true, true, true, true, true, false, false, 'kn'),
    ('usrset01-0000-0000-0000-000000000006', 'o0000001-0000-0000-0000-000000000001', true, true, true, true, true, true, true, false, 'en');

-- =====================================================
-- SUMMARY OF DUMMY DATA
-- =====================================================
-- Users:
--   - 1 Admin
--   - 6 Customers (5 active, 1 pending)
--   - 6 Drivers (4 active, 1 pending, 1 inactive)
--   - 2 Cab Owners (1 active, 1 pending)
--   - 1 Support Staff
-- 
-- Cabs: 5 vehicles (3 active, 1 maintenance, 1 inactive)
-- Trips: 8 trips (5 completed, 1 cancelled, 1 in-progress, 1 driver-arriving)
-- Rentals: 4 rentals (1 completed, 1 confirmed, 1 active, 1 pending)
-- Payments: 8 payments (7 completed, 1 pending)
-- Disputes: 3 disputes (1 resolved, 1 in-progress, 1 open)
-- Community Trips: 5 trips (all active)
-- Document Verifications: 8 documents (5 approved, 3 pending)
-- Notifications: 7 notifications (4 read, 3 unread)
-- =====================================================

-- Verify data was inserted
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Driver Profiles', COUNT(*) FROM driver_profiles
UNION ALL
SELECT 'Cab Owner Profiles', COUNT(*) FROM cab_owner_profiles
UNION ALL
SELECT 'Cabs', COUNT(*) FROM cabs
UNION ALL
SELECT 'Trips', COUNT(*) FROM trips
UNION ALL
SELECT 'Rentals', COUNT(*) FROM rentals
UNION ALL
SELECT 'Payments', COUNT(*) FROM payments
UNION ALL
SELECT 'Earnings', COUNT(*) FROM earnings
UNION ALL
SELECT 'Disputes', COUNT(*) FROM disputes
UNION ALL
SELECT 'Emergency Contacts', COUNT(*) FROM emergency_contacts
UNION ALL
SELECT 'Community Trips', COUNT(*) FROM community_trips
UNION ALL
SELECT 'Document Verifications', COUNT(*) FROM document_verifications
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'User Settings', COUNT(*) FROM user_settings;
