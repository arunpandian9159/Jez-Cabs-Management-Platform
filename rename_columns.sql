-- Rename columns from camelCase to snake_case in Supabase
-- Execute these ALTER TABLE statements to rename all columns

-- Companies table
ALTER TABLE companies RENAME COLUMN companyid TO company_id;
ALTER TABLE companies RENAME COLUMN contactemail TO contact_email;
ALTER TABLE companies RENAME COLUMN contactphone TO contact_phone;
ALTER TABLE companies RENAME COLUMN subscriptiontier TO subscription_tier;
ALTER TABLE companies RENAME COLUMN isactive TO is_active;
ALTER TABLE companies RENAME COLUMN createdat TO created_at;
ALTER TABLE companies RENAME COLUMN updatedat TO updated_at;

-- Users table
ALTER TABLE users RENAME COLUMN companyid TO company_id;
ALTER TABLE users RENAME COLUMN passwordhash TO password_hash;
ALTER TABLE users RENAME COLUMN firstname TO first_name;
ALTER TABLE users RENAME COLUMN lastname TO last_name;
ALTER TABLE users RENAME COLUMN phonenumber TO phone_number;
ALTER TABLE users RENAME COLUMN isactive TO is_active;
ALTER TABLE users RENAME COLUMN createdat TO created_at;
ALTER TABLE users RENAME COLUMN updatedat TO updated_at;

-- Cabs table
ALTER TABLE cabs RENAME COLUMN companyid TO company_id;
ALTER TABLE cabs RENAME COLUMN registrationnumber TO registration_number;
ALTER TABLE cabs RENAME COLUMN seatingcapacity TO seating_capacity;
ALTER TABLE cabs RENAME COLUMN fueltype TO fuel_type;
ALTER TABLE cabs RENAME COLUMN insuranceexpiry TO insurance_expiry;
ALTER TABLE cabs RENAME COLUMN insuranceprovider TO insurance_provider;
ALTER TABLE cabs RENAME COLUMN insurancepolicynumber TO insurance_policy_number;
ALTER TABLE cabs RENAME COLUMN registrationexpiry TO registration_expiry;
ALTER TABLE cabs RENAME COLUMN gpsdeviceid TO gps_device_id;
ALTER TABLE cabs RENAME COLUMN dailyrentalrate TO daily_rental_rate;
ALTER TABLE cabs RENAME COLUMN currentmileage TO current_mileage;
ALTER TABLE cabs RENAME COLUMN createdat TO created_at;
ALTER TABLE cabs RENAME COLUMN updatedat TO updated_at;

-- Drivers table
ALTER TABLE drivers RENAME COLUMN companyid TO company_id;
ALTER TABLE drivers RENAME COLUMN firstname TO first_name;
ALTER TABLE drivers RENAME COLUMN lastname TO last_name;
ALTER TABLE drivers RENAME COLUMN contactnumber TO contact_number;
ALTER TABLE drivers RENAME COLUMN licensenumber TO license_number;
ALTER TABLE drivers RENAME COLUMN licenseexpiry TO license_expiry;
ALTER TABLE drivers RENAME COLUMN licensetype TO license_type;
ALTER TABLE drivers RENAME COLUMN dateofbirth TO date_of_birth;
ALTER TABLE drivers RENAME COLUMN emergencycontactname TO emergency_contact_name;
ALTER TABLE drivers RENAME COLUMN emergencycontactnumber TO emergency_contact_number;
ALTER TABLE drivers RENAME COLUMN isactive TO is_active;
ALTER TABLE drivers RENAME COLUMN createdat TO created_at;
ALTER TABLE drivers RENAME COLUMN updatedat TO updated_at;

-- Bookings table
ALTER TABLE bookings RENAME COLUMN companyid TO company_id;
ALTER TABLE bookings RENAME COLUMN cabid TO cab_id;
ALTER TABLE bookings RENAME COLUMN driverid TO driver_id;
ALTER TABLE bookings RENAME COLUMN clientname TO client_name;
ALTER TABLE bookings RENAME COLUMN clientcontactperson TO client_contact_person;
ALTER TABLE bookings RENAME COLUMN clientemail TO client_email;
ALTER TABLE bookings RENAME COLUMN clientphone TO client_phone;
ALTER TABLE bookings RENAME COLUMN startdate TO start_date;
ALTER TABLE bookings RENAME COLUMN enddate TO end_date;
ALTER TABLE bookings RENAME COLUMN pickuplocation TO pickup_location;
ALTER TABLE bookings RENAME COLUMN dropofflocation TO dropoff_location;
ALTER TABLE bookings RENAME COLUMN totalamount TO total_amount;
ALTER TABLE bookings RENAME COLUMN advanceamount TO advance_amount;
ALTER TABLE bookings RENAME COLUMN createdat TO created_at;
ALTER TABLE bookings RENAME COLUMN updatedat TO updated_at;

-- Invoices table
ALTER TABLE invoices RENAME COLUMN companyid TO company_id;
ALTER TABLE invoices RENAME COLUMN bookingid TO booking_id;
ALTER TABLE invoices RENAME COLUMN invoicenumber TO invoice_number;
ALTER TABLE invoices RENAME COLUMN taxamount TO tax_amount;
ALTER TABLE invoices RENAME COLUMN totalamount TO total_amount;
ALTER TABLE invoices RENAME COLUMN issuedate TO issue_date;
ALTER TABLE invoices RENAME COLUMN duedate TO due_date;
ALTER TABLE invoices RENAME COLUMN paymentlink TO payment_link;
ALTER TABLE invoices RENAME COLUMN pdfurl TO pdf_url;
ALTER TABLE invoices RENAME COLUMN paiddate TO paid_date;
ALTER TABLE invoices RENAME COLUMN paymentmethod TO payment_method;
ALTER TABLE invoices RENAME COLUMN paymentreference TO payment_reference;
ALTER TABLE invoices RENAME COLUMN createdat TO created_at;
ALTER TABLE invoices RENAME COLUMN updatedat TO updated_at;
