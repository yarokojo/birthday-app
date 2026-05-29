const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rxjpjeyzwxdcqxnvtulq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4anBqZXl6d3hkY3F4bnZ0dWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NjA5OTUsImV4cCI6MjA5NTUzNjk5NX0.i6_v16g5I14zqVv_f_xLOj1EIfVBfyv_6fCZmWv32zI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = { supabase };
