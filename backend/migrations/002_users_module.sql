-- Users Module: Saved Addresses, Payment Methods, Wallet, Transactions
-- Run this migration to create the required tables for the users module

-- Saved Addresses Table
CREATE TABLE IF NOT EXISTS saved_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    lat DECIMAL(10, 7) NOT NULL,
    lng DECIMAL(10, 7) NOT NULL,
    icon VARCHAR(10),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recent Destinations Table
CREATE TABLE IF NOT EXISTS recent_destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    lat DECIMAL(10, 7) NOT NULL,
    lng DECIMAL(10, 7) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Methods Table
CREATE TYPE payment_method_type AS ENUM ('card', 'upi', 'wallet', 'netbanking');

CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type payment_method_type NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    last_four VARCHAR(4),
    upi_id VARCHAR(50),
    is_default BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallets Table
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(10, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'INR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TYPE transaction_type AS ENUM ('payment', 'refund', 'topup', 'withdrawal');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    status transaction_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    trip_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_addresses_user_id ON saved_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_recent_destinations_user_id ON recent_destinations(user_id);
CREATE INDEX IF NOT EXISTS idx_recent_destinations_used_at ON recent_destinations(user_id, used_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(user_id, created_at DESC);

-- Insert some default saved addresses for existing users (optional demo data)
-- This inserts default "Home" and "Work" placeholders for the first customer user
DO $$
DECLARE
    customer_id UUID;
BEGIN
    -- Get the first customer user
    SELECT id INTO customer_id FROM users WHERE role = 'customer' LIMIT 1;
    
    IF customer_id IS NOT NULL THEN
        -- Insert demo saved addresses if none exist
        IF NOT EXISTS (SELECT 1 FROM saved_addresses WHERE user_id = customer_id) THEN
            INSERT INTO saved_addresses (user_id, label, address, lat, lng, icon, is_default) VALUES
            (customer_id, 'Home', '123 Main Street, Chennai', 13.0827, 80.2707, '🏠', true),
            (customer_id, 'Work', 'Tech Park, OMR Road, Chennai', 12.9716, 80.2401, '💼', false);
        END IF;
        
        -- Create wallet for customer if not exists
        IF NOT EXISTS (SELECT 1 FROM wallets WHERE user_id = customer_id) THEN
            INSERT INTO wallets (user_id, balance, currency) VALUES
            (customer_id, 500.00, 'INR');
        END IF;
    END IF;
END $$;
