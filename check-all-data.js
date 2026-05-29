const { supabase } = require('./lib/supabase.js');

async function checkAllData() {
  console.log('🔍 Checking all user data...\n');
  
  const userId = '171e90a3-e5ec-4a8c-8707-73298de3f941';
  
  // Check profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (profileError) {
    console.log('❌ Profile:', profileError.message);
  } else {
    console.log('✅ Profile:', profile.name, profile.email);
  }
  
  // Check wallet
  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (walletError) {
    console.log('❌ Wallet:', walletError.message);
  } else {
    console.log('✅ Wallet: balance =', wallet.balance);
  }
  
  // Check posts
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId);
  
  if (postsError) {
    console.log('❌ Posts error:', postsError.message);
  } else {
    console.log(`✅ Posts: ${posts.length} posts found`);
    if (posts.length > 0) {
      console.log('   Latest:', posts[posts.length-1]?.content?.substring(0, 50));
    }
  }
}

checkAllData();
