import { supabase } from './supabase.js';
import * as FileSystem from 'expo-file-system';

export const uploadVideo = async (localUri, userId) => {
  try {
    // Generate unique filename
    const fileExt = localUri.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    // Read the file
    const fileData = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Convert base64 to blob
    const blob = base64ToBlob(fileData, `video/${fileExt}`);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, blob, {
        contentType: `video/${fileExt}`,
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading video:', error);
    return null;
  }
};

function base64ToBlob(base64, contentType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}
