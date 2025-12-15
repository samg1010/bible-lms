// src/types/index.ts

export interface UserDocument {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  uploaded_at: string;
  // Add any other fields that exist in your 'user_documents' table
  // e.g., size?: number;
  // mime_type?: string;
}

// You can add and export more types here later
// export interface OtherType { ... }