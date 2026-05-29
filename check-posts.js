const { supabase } = require('./lib/supabase.js');
(async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('id, content, video_url, created_at')
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) console.error('Error:', error.message);
  else {
    console.log(`Found ${data.length} posts`);
    data.forEach(p => {
      console.log(`- ${p.content || 'no text'} | video: ${p.video_url ? 'yes' : 'no'}`);
    });
  }
})();
