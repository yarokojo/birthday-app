const { supabase } = require('./lib/supabase.js');

async function testSignup() {
  console.log('📝 Testing user signup...\n');
  
  const timestamp = Date.now();
  const testEmail = `test${timestamp}@example.com`;
  const testPassword = 'Test123456';
  
  console.log('Test Email:', testEmail);
  console.log('Test Password:', testPassword);
  console.log('');
  
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        name: 'Test User',
        birthday: '1995-06-15',
      },
    },
  });
  
  if (error) {
    console.log('❌ Signup failed:', error.message);
  } else {
    console.log('✅ Signup successful!');
    console.log('User ID:', data.user?.id);
    console.log('\n💡 You can now login with these credentials:');
    console.log('📧 Email:', testEmail);
    console.log('🔑 Password:', testPassword);
  }
}

testSignup();
