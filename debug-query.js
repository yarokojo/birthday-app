const { supabase } = require('./lib/supabase.js');

async function debugQuery() {
  console.log('🔍 Debugging database...\n');
  
  const userId = '171e90a3-e5ec-4a8c-8707-73298de3f941';
  
  // Check profiles without .single()
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId);
  
  if (profileError) {
    console.log('❌ Profile query error:', profileError.message);
  } else {
    console.log(`📊 Profiles found: ${profiles.length}`);
    if (profiles.length > 0) {
      console.log('Profile data:', profiles[0]);
    } else {
      console.log('⚠️ No profile found for this user ID');
      console.log('💡 You need to create a profile first');
    }
  }
  
  // Check wallets without .single()
  const { data: wallets, error: walletError } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId);
  
  if (walletError) {
    console.log('❌ Wallet query error:', walletError.message);
  } else {
    console.log(`💰 Wallets found: ${wallets.length}`);
    if (wallets.length > 0) {
      console.log('Wallet data:', wallets[0]);
    } else {
      console.log('⚠️ No wallet found for this user ID');
    }
  }
  
  // Check if user exists in auth
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    console.log('\n✅ Auth user exists:', user.email);
    console.log('   User ID:', user.id);
  } else {
    console.log('\n⚠️ No auth user found in this session');
  }
}

debugQuery();
