import { supabase } from './supabase';

export const uploadVideo = async (localUri: string, userId: string): Promise<string | null> => {
  try {
    alert("1. Starting upload...");
    const response = await fetch(localUri);
    alert("2. Fetched blob");
    const blob = await response.blob();
    alert(`3. Got blob, size: ${blob.size} bytes`);
    
    const formData = new FormData();
    formData.append('file', blob, `video_${Date.now()}.mp4`);
    formData.append('upload_preset', 'birthday_app_preset');
    formData.append('resource_type', 'video');
    
    alert("4. Uploading to Cloudinary...");
    const uploadRes = await fetch('https://api.cloudinary.com/v1_1/dirz9omvl/video/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await uploadRes.json();
    alert(`5. Cloudinary response: ${data.secure_url ? 'SUCCESS' : 'FAILED'}`);
    
    if (data.secure_url) {
      return data.secure_url;
    }
    return null;
  } catch (error: any) {
    alert(`Upload error: ${error.message}`);
    return null;
  }
};
