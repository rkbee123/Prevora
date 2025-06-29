-- Add username column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS username TEXT DEFAULT '';

-- Create index for username for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- Update existing profiles to have a default username based on email
UPDATE user_profiles 
SET username = SPLIT_PART(
  (SELECT email FROM auth.users WHERE auth.users.id = user_profiles.id), 
  '@', 
  1
)
WHERE username = '' OR username IS NULL;