-- Complete Jez Cabs Management Platform Database Setup
-- Run this entire script in Supabase SQL Editor

-- ===========================================
-- STEP 1: Create Enum Types
-- ===========================================

CREATE TYPE bookings_status_enum AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
CREATE TYPE cabs_status_enum AS ENUM ('AVAILABLE', 'IN_MAINTENANCE', 'OUT_OF_SERVICE');
CREATE TYPE invoices_status_enum AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED');
CREATE TYPE users_role_enum AS ENUM ('ADMIN', 'MANAGER', 'DRIVER', 'STAFF');

-- ===========================================
-- STEP 2: Create Tables with Snake_Case Columns
-- ===========================================

CREATE TABLE public.companies (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  address text,
  contact_email character varying NOT NULL UNIQUE,
  contact_phone character varying,
  subscription_tier character varying NOT NULL DEFAULT 'BASIC'::character varying,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT companies_pkey PRIMARY KEY (id)
);

CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL,
  email character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  role users_role_enum NOT NULL DEFAULT 'STAFF'::users_role_enum,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  phone_number character varying,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT FK_6f9395c9037632a31107c8a9e58 FOREIGN KEY (company_id) REFERENCES public.companies(id)
);

CREATE TABLE public.cabs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL,
  make character varying NOT NULL,
  model character varying NOT NULL,
  year integer NOT NULL,
  registration_number character varying NOT NULL,
  vin character varying,
  status cabs_status_enum NOT NULL DEFAULT 'AVAILABLE'::cabs_status_enum,
  color character varying,
  seating_capacity integer,
  fuel_type character varying,
  insurance_expiry date,
  insurance_provider character varying,
  insurance_policy_number character varying,
  registration_expiry date,
  gps_device_id character varying,
  daily_rental_rate numeric,
  current_mileage integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT cabs_pkey PRIMARY KEY (id),
  CONSTRAINT FK_eeb05dd117ebadf0d96f6a7bc94 FOREIGN KEY (company_id) REFERENCES public.companies(id)
);

CREATE TABLE public.drivers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  contact_number character varying NOT NULL,
  email character varying,
  license_number character varying NOT NULL,
  license_expiry date NOT NULL,
  license_type character varying,
  date_of_birth date,
  address text,
  emergency_contact_name character varying,
  emergency_contact_number character varying,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT drivers_pkey PRIMARY KEY (id),
  CONSTRAINT FK_658e386266eb3045c0fc9776dd2 FOREIGN KEY (company_id) REFERENCES public.companies(id)
);

CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL,
  cab_id uuid NOT NULL,
  driver_id uuid,
  client_name character varying NOT NULL,
  client_contact_person character varying NOT NULL,
  client_email character varying NOT NULL,
  client_phone character varying NOT NULL,
  start_date timestamp without time zone NOT NULL,
  end_date timestamp without time zone NOT NULL,
  pickup_location character varying,
  dropoff_location character varying,
  total_amount numeric NOT NULL DEFAULT '0'::numeric,
  advance_amount numeric DEFAULT '0'::numeric,
  status bookings_status_enum NOT NULL DEFAULT 'PENDING'::bookings_status_enum,
  notes text,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT FK_c03bf1d4e751064331c41db5d65 FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT FK_198f4508ca35baa8cf8f7b317f2 FOREIGN KEY (cab_id) REFERENCES public.cabs(id),
  CONSTRAINT FK_100b344bc1e04cc839fe90c3d53 FOREIGN KEY (driver_id) REFERENCES public.drivers(id)
);

CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL,
  booking_id uuid NOT NULL,
  invoice_number character varying NOT NULL UNIQUE,
  amount numeric NOT NULL DEFAULT '0'::numeric,
  tax_amount numeric NOT NULL DEFAULT '0'::numeric,
  total_amount numeric NOT NULL DEFAULT '0'::numeric,
  issue_date date NOT NULL,
  due_date date NOT NULL,
  status invoices_status_enum NOT NULL DEFAULT 'DRAFT'::invoices_status_enum,
  payment_link character varying,
  pdf_url character varying,
  paid_date date,
  payment_method character varying,
  payment_reference character varying,
  notes text,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT invoices_pkey PRIMARY KEY (id),
  CONSTRAINT FK_0b793047e7030ef060eaae8438a FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT FK_eca01fda44679cc1c342822e01b FOREIGN KEY (booking_id) REFERENCES public.bookings(id)
);

-- ===========================================
-- STEP 3: Insert Dummy Data
-- ===========================================

-- Insert Companies
INSERT INTO companies (id, name, address, contact_email, contact_phone, subscription_tier, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Jez Cabs Ltd', '123 Main Street, City Center, Mumbai, Maharashtra 400001', 'admin@jezcabs.com', '+91-9876543210', 'PREMIUM', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'City Ride Services', '456 Business Park, Andheri West, Mumbai, Maharashtra 400058', 'contact@cityride.com', '+91-9876543211', 'BASIC', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Metro Cab Co', '789 Industrial Area, Goregaon East, Mumbai, Maharashtra 400062', 'info@metrocab.com', '+91-9876543212', 'STANDARD', true, NOW(), NOW());

-- Insert Users
INSERT INTO users (id, company_id, email, password_hash, first_name, last_name, role, phone_number, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'admin@jezcabs.com', '$2b$10$dummy.hash.for.demo.purposes.only', 'Rajesh', 'Sharma', 'ADMIN', '+91-9876543210', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'manager@jezcabs.com', '$2b$10$dummy.hash.for.demo.purposes.only', 'Priya', 'Patel', 'MANAGER', '+91-9876543211', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'driver1@jezcabs.com', '$2b$10$dummy.hash.for.demo.purposes.only', 'Amit', 'Kumar', 'DRIVER', '+91-9876543212', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'admin@cityride.com', '$2b$10$dummy.hash.for.demo.purposes.only', 'Sunil', 'Verma', 'ADMIN', '+91-9876543213', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'admin@metrocab.com', '$2b$10$dummy.hash.for.demo.purposes.only', 'Kavita', 'Singh', 'ADMIN', '+91-9876543214', true, NOW(), NOW());

-- Insert Cabs
INSERT INTO cabs (id, company_id, make, model, year, registration_number, vin, status, color, seating_capacity, fuel_type, insurance_expiry, insurance_provider, insurance_policy_number, registration_expiry, gps_device_id, daily_rental_rate, current_mileage, notes, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440001', 'Toyota', 'Innova', 2020, 'MH01AB1234', '1HGCM82633A123456', 'AVAILABLE', 'White', 7, 'Diesel', '2025-12-31', 'Bajaj Allianz', 'POL123456789', '2026-06-30', 'GPS001', 2500.00, 45000, 'Well maintained vehicle', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Mahindra', 'Scorpio', 2019, 'MH01CD5678', '1HGCM82633A123457', 'AVAILABLE', 'Black', 7, 'Diesel', '2025-11-30', 'ICICI Lombard', 'POL123456790', '2026-05-31', 'GPS002', 2200.00, 52000, 'Recently serviced', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'Honda', 'City', 2021, 'MH01EF9012', '1HGCM82633A123458', 'IN_MAINTENANCE', 'Silver', 5, 'Petrol', '2026-01-31', 'HDFC Ergo', 'POL123456791', '2026-07-31', 'GPS003', 1800.00, 28000, 'Under maintenance', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', 'Hyundai', 'Verna', 2022, 'MH02GH3456', '1HGCM82633A123459', 'AVAILABLE', 'Blue', 5, 'Petrol', '2026-03-31', 'Reliance General', 'POL123456792', '2026-09-30', 'GPS004', 2000.00, 15000, 'New vehicle', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', 'Tata', 'Tiago', 2023, 'MH03IJ7890', '1HGCM82633A123460', 'AVAILABLE', 'Red', 5, 'CNG', '2026-05-31', 'New India Assurance', 'POL123456793', '2026-11-30', 'GPS005', 1600.00, 8000, 'Eco-friendly CNG vehicle', NOW(), NOW());

-- Insert Drivers
INSERT INTO drivers (id, company_id, first_name, last_name, contact_number, email, license_number, license_expiry, license_type, date_of_birth, address, emergency_contact_name, emergency_contact_number, is_active, notes, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440001', 'Ravi', 'Shankar', '+91-9876543213', 'ravi.shankar@email.com', 'MH0123456789', '2027-08-15', 'LMV', '1985-03-20', 'Bandra West, Mumbai', 'Meera Shankar', '+91-9876543214', true, 'Experienced driver with 8+ years', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', 'Suresh', 'Nair', '+91-9876543215', 'suresh.nair@email.com', 'MH0123456790', '2026-12-20', 'LMV', '1988-07-10', 'Andheri East, Mumbai', 'Latha Nair', '+91-9876543216', true, 'Reliable driver', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440001', 'Vijay', 'Joshi', '+91-9876543217', 'vijay.joshi@email.com', 'MH0123456791', '2028-01-25', 'LMV', '1982-11-05', 'Goregaon West, Mumbai', 'Poonam Joshi', '+91-9876543218', true, 'Senior driver with excellent ratings', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440002', 'Arun', 'Desai', '+91-9876543219', 'arun.desai@email.com', 'MH0223456789', '2027-05-10', 'LMV', '1986-09-15', 'Powai, Mumbai', 'Kiran Desai', '+91-9876543220', true, 'Professional driver', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440003', 'Mohan', 'Reddy', '+91-9876543221', 'mohan.reddy@email.com', 'MH0323456789', '2026-10-30', 'LMV', '1984-01-22', 'Thane West, Mumbai', 'Lakshmi Reddy', '+91-9876543222', true, 'Experienced chauffeur', NOW(), NOW());

-- Insert Bookings
INSERT INTO bookings (id, company_id, cab_id, driver_id, client_name, client_contact_person, client_email, client_phone, start_date, end_date, pickup_location, dropoff_location, total_amount, advance_amount, status, notes, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440014', 'Tech Solutions Pvt Ltd', 'Mr. Anil Gupta', 'anil.gupta@techsolutions.com', '+91-9876543223', '2025-10-15 09:00:00', '2025-10-17 18:00:00', 'Mumbai Airport', 'Hotel Taj Mahal Palace', 7500.00, 2500.00, 'CONFIRMED', 'Airport pickup required', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440015', 'Global Industries', 'Ms. Priya Sharma', 'priya.sharma@globalind.com', '+91-9876543224', '2025-10-20 14:00:00', '2025-10-20 22:00:00', 'CST Station', 'Pune Railway Station', 4500.00, 1500.00, 'COMPLETED', 'One way trip to Pune', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440009', NULL, 'Wedding Planners Inc', 'Mr. Raj Malhotra', 'raj.malhotra@weddings.com', '+91-9876543225', '2025-11-05 16:00:00', '2025-11-07 02:00:00', 'Marriage Hall, Bandra', 'Airport for honeymoon trip', 12000.00, 4000.00, 'PENDING', 'Wedding transportation with decorations', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440017', 'Corporate Events Ltd', 'Ms. Sneha Kapoor', 'sneha.kapoor@corp.com', '+91-9876543226', '2025-10-25 08:00:00', '2025-10-26 20:00:00', 'Corporate Office, Lower Parel', 'Goa Airport', 8500.00, 3000.00, 'CONFIRMED', 'Business trip to Goa', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440018', 'Travel Agency Mumbai', 'Mr. Vikram Singh', 'vikram.singh@travel.com', '+91-9876543227', '2025-10-30 10:00:00', '2025-10-30 18:00:00', 'Colaba Causeway', 'Elephanta Caves', 3200.00, 1000.00, 'COMPLETED', 'Sightseeing tour', NOW(), NOW());

-- Insert Invoices
INSERT INTO invoices (id, company_id, booking_id, invoice_number, amount, tax_amount, total_amount, issue_date, due_date, status, payment_link, pdf_url, paid_date, payment_method, payment_reference, notes, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440019', 'INV-2025-001', 7500.00, 1125.00, 8625.00, '2025-10-10', '2025-10-20', 'SENT', 'https://payment.jezcabs.com/inv-2025-001', 'https://docs.jezcabs.com/invoices/INV-2025-001.pdf', NULL, NULL, NULL, 'Invoice for airport transfer service', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440020', 'INV-2025-002', 4500.00, 675.00, 5175.00, '2025-10-18', '2025-10-28', 'PAID', NULL, 'https://docs.jezcabs.com/invoices/INV-2025-002.pdf', '2025-10-22', 'Bank Transfer', 'TXN123456789', 'Payment received successfully', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', 'INV-2025-003', 12000.00, 1800.00, 13800.00, '2025-10-25', '2025-11-05', 'DRAFT', NULL, NULL, NULL, NULL, NULL, 'Draft invoice for wedding transportation', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440022', 'INV-2025-004', 8500.00, 1275.00, 9775.00, '2025-10-20', '2025-10-30', 'SENT', 'https://payment.cityride.com/inv-2025-004', 'https://docs.cityride.com/invoices/INV-2025-004.pdf', NULL, NULL, NULL, 'Business trip invoice', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440023', 'INV-2025-005', 3200.00, 480.00, 3680.00, '2025-10-28', '2025-11-07', 'PAID', NULL, 'https://docs.metrocab.com/invoices/INV-2025-005.pdf', '2025-10-31', 'Cash', 'CASH-001', 'Cash payment at destination', NOW(), NOW());
