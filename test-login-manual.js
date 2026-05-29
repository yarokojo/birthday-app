const { supabase } = require('./lib/supabase.js');

async function testLogin() {
  console.log('🔐 Testing login with manually created user...\n');
  
  const email = 'appuser@example.com';
  const password = 'Test123456';
  
  console.log('Email:', email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  
  if (error) {
    console.log('❌ Login failed:', error.message);
  } else {
    console.log('✅ Login successful!');
    console.log('User ID:', data.user?.id);
    console.log('Email:', data.user?.email);
    console.log('\n🎉 Your Supabase backend is ready!');
    console.log('💡 Now update your App.tsx to use these credentials.');
  }
}

testLogin();
