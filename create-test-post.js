const { supabase } = require('./lib/supabase.js');

async function createPost() {
  console.log('📝 Creating test post...\n');
  
  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: '171e90a3-e5ec-4a8c-8707-73298de3f941',
      content: '🎉 Test post from command line! 🎂',
      celebration_type: 'birthday',
    })
    .select();
  
  if (error) {
    console.log('❌ Error:', error.message);
  } else {
    console.log('✅ Post created!');
  }
}

createPost();
