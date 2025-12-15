export interface UserFile {
  id: string
  user_id: string
  name: string
  url: string
  created_at: string
}

export interface UserProgress {
  id?: string
  user_id: string
  document_id: string
  progress_percentage: number
  last_read_at?: string
}