const { supabase } = require('./lib/supabase.js');

(async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('id, content, video_url, image_url')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Recent posts:');
    data.forEach(post => {
      console.log(`  - Content: ${post.content ? post.content.substring(0, 30) : 'EMPTY'}`);
      console.log(`    Video URL: ${post.video_url || 'NO VIDEO'}`);
      console.log(`    Image URL: ${post.image_url || 'NO IMAGE'}`);
      console.log('---');
    });
  }
})();
