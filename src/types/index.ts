// src/types/index.ts
export type { UserDocument } from './UserDocument' // if in separate files
// OR directly define and export here
export interface UserDocument {
  // your type definition
}

// Re-export other common types
export * from './otherTypes'