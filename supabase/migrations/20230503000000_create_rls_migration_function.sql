-- Create a function to execute the RLS migration
CREATE OR REPLACE FUNCTION execute_rls_migration()
RETURNS void AS $$
BEGIN
  -- Drop existing RLS policies for the users table
  DROP POLICY IF EXISTS "Users can view their own user data." ON users;
  DROP POLICY IF EXISTS "Users can update their own user data." ON users;
  DROP POLICY IF EXISTS "Users can insert their own user data." ON users;

  -- Create new RLS policies for the users table
  CREATE POLICY "Users can view their own user data."
    ON users
    FOR SELECT
    USING (auth.uid() = id);

  CREATE POLICY "Users can update their own user data."
    ON users
    FOR UPDATE
    USING (auth.uid() = id);

  -- This policy allows the service role to insert new users
  CREATE POLICY "Service role can insert new users."
    ON users
    FOR INSERT
    WITH CHECK (
      -- Allow users to insert their own data (for backward compatibility)
      auth.uid() = id
    );

  -- Drop existing RLS policies for the artist_profile table
  DROP POLICY IF EXISTS "Artists can view their own profile." ON artist_profile;
  DROP POLICY IF EXISTS "Artists can update their own profile." ON artist_profile;
  DROP POLICY IF EXISTS "Artists can insert their own profile." ON artist_profile;

  -- Create new RLS policies for the artist_profile table
  CREATE POLICY "Artists can view their own profile."
    ON artist_profile
    FOR SELECT
    USING (auth.uid() = id);

  CREATE POLICY "Artists can update their own profile."
    ON artist_profile
    FOR UPDATE
    USING (auth.uid() = id);

  -- This policy allows the service role to insert new artist profiles
  CREATE POLICY "Service role can insert new artist profiles."
    ON artist_profile
    FOR INSERT
    WITH CHECK (
      -- Allow artists to insert their own profile (for backward compatibility)
      auth.uid() = id
    );
END;
$$ LANGUAGE plpgsql;
