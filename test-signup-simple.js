const { supabase } = require('./lib/supabase.js');

async function testSignup() {
  console.log('📝 Testing user signup...\n');
  
  // Use a very simple email
  const testEmail = 'demouser@test.com';
  const testPassword = 'Demo123456';
  
  console.log('Test Email:', testEmail);
  console.log('Test Password:', testPassword);
  console.log('');
  
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        name: 'Demo User',
        birthday: '1990-01-01',
      },
    },
  });
  
  if (error) {
    console.log('❌ Signup failed:', error.message);
    console.log('\n📋 Error details:', JSON.stringify(error, null, 2));
  } else {
    console.log('✅ Signup successful!');
    console.log('User ID:', data.user?.id);
    console.log('\n💡 Login credentials:');
    console.log('📧 Email:', testEmail);
    console.log('🔑 Password:', testPassword);
  }
}

testSignup();
