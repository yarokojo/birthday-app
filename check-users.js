const { supabase } = require('./lib/supabase.js');

async function checkUsers() {
  console.log('👥 Checking for existing users...\n');
  
  // Try to get the current session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    console.log('✅ You are already logged in!');
    console.log('User:', session.user.email);
    console.log('User ID:', session.user.id);
  } else {
    console.log('📭 No active session');
    console.log('\n💡 You can create a user through:');
    console.log('1. Supabase Dashboard: https://supabase.com/dashboard/project/rxjpjeyzwxdcqxnvtulq/auth/users');
    console.log('2. Or wait a few minutes for the rate limit to reset and try signup again');
  }
  
  console.log('\n💡 Alternative: Use the "Go true" button in AI Studio to run the app');
  console.log('   This will allow signup through the actual app interface.');
}

checkUsers();
