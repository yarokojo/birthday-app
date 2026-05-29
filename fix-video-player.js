const fs = require('fs');
const path = './App.tsx';
let content = fs.readFileSync(path, 'utf8');

const newBlock = `if (view === "video_player" && selectedVideoId) {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', selectedVideoId)
    .single();

  if (!error && post && post.video_url) {
    const video = {
      id: post.id,
      user: post.author_name || userProfile.name,
      handle: post.author_handle || userProfile.username,
      avatar: post.author_avatar || userProfileImage,
      description: post.content || "Video",
      music: "Original Audio",
      likes: String(post.likes_count || 0),
      comments: String(post.comments_count || 0),
      videoUrl: post.video_url,
      poster: post.image_url || "",
      isBirthday: post.celebration_type === 'birthday'
    };
    return <VideoScreen reels={[video]} userProfileImage={userProfileImage} onBack={() => { setView(null); setSelectedVideoId(null); }} onNavigate={navigateTo} />;
  } else {
    setView(null);
    setSelectedVideoId(null);
  }
}`;

const regex = /if\s*\(\s*view\s*===\s*"video_player"\s*&&\s*selectedVideoId\s*\)\s*\{[\s\S]*?\n\s*\}/;
if (regex.test(content)) {
  content = content.replace(regex, newBlock);
  fs.writeFileSync(path, content);
  console.log('✅ App.tsx patched successfully');
} else {
  console.log('⚠️ Pattern not found – manual patch required');
}
