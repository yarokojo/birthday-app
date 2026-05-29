const { supabase } = require('./lib/supabase.js');

async function testLogin() {
  console.log('🔐 Testing user login...\n');
  
  // Use one of your previously created test emails
  // Try different emails if you remember them
  const emails = [
    'test1779971768268@example.com',
    'demouser@test.com',
    'testuser123@example.com'
  ];
  
  const password = 'Test123456';
  
  for (const email of emails) {
    console.log(`Trying: ${email}`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    
    if (!error && data.user) {
      console.log('✅ Login successful!');
      console.log('User ID:', data.user.id);
      console.log('Email:', data.user.email);
      console.log('\n🎉 Your Supabase auth is working!');
      console.log('💡 You can now use this user in your app.');
      return;
    }
  }
  
  console.log('\n❌ Could not login with any test account.');
  console.log('💡 The rate limit will reset after a few minutes.');
  console.log('💡 Or use the Supabase Dashboard to create a user manually:');
  console.log('https://supabase.com/dashboard/project/rxjpjeyzwxdcqxnvtulq/auth/users');
}

testLogin();
