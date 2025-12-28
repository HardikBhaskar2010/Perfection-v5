-- =====================================================
-- ENHANCED SCHEMA FOR USER PREFERENCES & SETTINGS
-- Run this AFTER the main supabase_schema.sql
-- =====================================================

-- =====================================================
-- USER PREFERENCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Theme preferences
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  
  -- Language preference
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es', 'fr', 'de', 'hi', 'ja')),
  
  -- Notification preferences
  notifications JSONB DEFAULT '{
    "ai_suggestions": true,
    "new_components": true,
    "weekly_ideas": true,
    "feature_updates": true
  }'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- =====================================================
-- PRIVACY SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS privacy_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Profile visibility
  profile_visibility TEXT DEFAULT 'private' CHECK (profile_visibility IN ('private', 'public')),
  
  -- Data usage for recommendations
  allow_data_usage BOOLEAN DEFAULT true,
  
  -- AI personalization
  ai_personalization BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE privacy_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own privacy settings" ON privacy_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own privacy settings" ON privacy_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own privacy settings" ON privacy_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_privacy_settings_user_id ON privacy_settings(user_id);

-- =====================================================
-- EMAIL PREFERENCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS email_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Email notification toggles (only valuable moments)
  account_created BOOLEAN DEFAULT true,
  project_first_save BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT true,
  feature_updates BOOLEAN DEFAULT true,
  
  -- Unsubscribe from all
  unsubscribe_all BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own email preferences" ON email_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email preferences" ON email_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email preferences" ON email_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_email_preferences_user_id ON email_preferences(user_id);

-- =====================================================
-- GUEST USERS TABLE (for temporary storage)
-- =====================================================
CREATE TABLE IF NOT EXISTS guest_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id TEXT UNIQUE NOT NULL,
  
  -- Guest data (stored temporarily)
  projects JSONB DEFAULT '[]'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Auto-cleanup after 30 days
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- No RLS needed - guests don't have auth.uid()
-- Index
CREATE INDEX IF NOT EXISTS idx_guest_users_guest_id ON guest_users(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_users_expires_at ON guest_users(expires_at);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_privacy_settings_updated_at
  BEFORE UPDATE ON privacy_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_preferences_updated_at
  BEFORE UPDATE ON email_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION TO AUTO-CREATE SETTINGS ON USER SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default preferences
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create default privacy settings
  INSERT INTO privacy_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create default email preferences
  INSERT INTO email_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create settings on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_settings();

-- =====================================================
-- FUNCTION TO CLEANUP OLD GUEST USERS
-- =====================================================
CREATE OR REPLACE FUNCTION cleanup_expired_guests()
RETURNS void AS $$
BEGIN
  DELETE FROM guest_users
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to run cleanup daily (if pg_cron is available)
-- Otherwise, run manually: SELECT cleanup_expired_guests();

-- =====================================================
-- HELPER VIEWS
-- =====================================================

-- View for complete user settings
CREATE OR REPLACE VIEW user_complete_settings AS
SELECT 
  p.user_id,
  p.theme,
  p.language,
  p.notifications,
  ps.profile_visibility,
  ps.allow_data_usage,
  ps.ai_personalization,
  ep.account_created,
  ep.project_first_save,
  ep.weekly_digest,
  ep.feature_updates,
  ep.unsubscribe_all
FROM user_preferences p
LEFT JOIN privacy_settings ps ON p.user_id = ps.user_id
LEFT JOIN email_preferences ep ON p.user_id = ep.user_id;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
GRANT SELECT ON user_complete_settings TO authenticated;

-- =====================================================
-- DONE! 🎉
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- After running supabase_schema.sql
