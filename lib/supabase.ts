import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rxjpjeyzwxdcqxnvtulq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4anBqZXl6d3hkY3F4bnZ0dWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NjA5OTUsImV4cCI6MjA5NTUzNjk5NX0.i6_v16g5I14zqVv_f_xLOj1EIfVBfyv_6fCZmWv32zI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
