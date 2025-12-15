// src/lib/uploadDocument.ts
import { supabase } from './supabaseClient'
import { UserDocument } from '@/types'

/**
 * Uploads a file to Supabase storage and inserts a record in `user_documents`
 * @param file - File object from input
 * @param userId - Logged-in user's ID
 */
export async function uploadDocument(file: File, userId: string): Promise<UserDocument | null> {
  try {
    // Generate a unique file path
    const filePath = `${userId}/${Date.now()}_${file.name}`

    // Upload to Supabase storage
    const { data: storageData, error: uploadError } = await supabase.storage
      .from('user-files')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage.from('user-files').getPublicUrl(filePath)
    const fileUrl = urlData.publicUrl

    // Insert into user_documents table
   const { data: document, error: insertError } = await supabase
  .from('user_documents')
  .insert({
    user_id: userId,
    file_name: file.name,
    file_path: filePath,
    // ... other fields
  })
  .select()
  // Optional: type the response properly
  .single<UserDocument>()

    if (insertError) throw insertError

    return document
  } catch (error: any) {
    console.error('Upload document error:', error.message)
    return null
  }
}
