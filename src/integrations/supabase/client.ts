import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nemeeextlweiguiqmzvk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lbWVlZXh0bHdlaWd1aXFtenZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NTcyMjgsImV4cCI6MjA4MTAzMzIyOH0.oUIzyMw8FrR3zVTAiqVc9k7JNsHfMxHiCLYSY_mnsZs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the supabase client like this:
// For React:
// import { supabase } from "@/integrations/supabase/client";
// For React Native:
// import { supabase } from "@/src/integrations/supabase/client";
