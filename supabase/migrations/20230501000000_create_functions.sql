-- Function to create artist_profile table if it doesn't exist
CREATE OR REPLACE FUNCTION create_artist_profile_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS artist_profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    bio TEXT,
    years_experience INTEGER DEFAULT 0,
    specialties TEXT[] DEFAULT '{}',
    personal_brand_statement TEXT,
    studio_name TEXT,
    location TEXT,
    is_mobile_artist BOOLEAN DEFAULT false,
    location_preferences TEXT,
    certifications TEXT,
    style_tags TEXT[] DEFAULT '{}',
    hourly_rate DECIMAL,
    minimum_price DECIMAL,
    deposit_percentage INTEGER DEFAULT 25,
    cancellation_hours INTEGER DEFAULT 48,
    pricing_faq TEXT,
    price_ranges JSONB,
    do_list TEXT[] DEFAULT '{}',
    dont_list TEXT[] DEFAULT '{}',
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    rating DECIMAL,
    cover_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
END;
$$ LANGUAGE plpgsql;

-- Function to migrate data from artist_profiles to artist_profile
CREATE OR REPLACE FUNCTION migrate_artist_profiles_data()
RETURNS void AS $$
BEGIN
  -- Insert data from artist_profiles to artist_profile if it doesn't exist
  INSERT INTO artist_profile (
    id, bio, years_experience, specialties, personal_brand_statement,
    studio_name, location, is_mobile_artist, location_preferences,
    certifications, style_tags, hourly_rate, rating, created_at, updated_at
  )
  SELECT 
    id, bio, years_experience, specialties, personal_brand_statement,
    studio_name, location, is_mobile_artist, location_preferences,
    certifications, style_tags, hourly_rate, rating, created_at, updated_at
  FROM artist_profiles
  WHERE id NOT IN (SELECT id FROM artist_profile);
END;
$$ LANGUAGE plpgsql;

-- Function to add missing columns to portfolio_images table
CREATE OR REPLACE FUNCTION add_missing_columns_to_portfolio_images()
RETURNS void AS $$
BEGIN
  -- Check if allows_design_replication column exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'portfolio_images' AND column_name = 'allows_design_replication'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE portfolio_images ADD COLUMN allows_design_replication BOOLEAN DEFAULT false;
  END IF;

  -- Check if description column exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'portfolio_images' AND column_name = 'description'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE portfolio_images ADD COLUMN description TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql;
