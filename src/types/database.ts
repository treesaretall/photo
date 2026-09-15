export interface Series {
  id: string
  title: string
  location: string
  year: number
  position: number
  created_at: string
}

export interface Photo {
  id: string
  series_id: string
  storage_path: string
  thumb_path: string
  medium_path: string
  caption: string | null
  position: number
  created_at: string
}

export interface Profile {
  id: true
  avatar_path: string | null
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      series: {
        Row: Pick<Series, keyof Series>
        Insert: Omit<Series, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<Series, 'id' | 'created_at'>>
        Relationships: []
      }
      photos: {
        Row: Pick<Photo, keyof Photo>
        Insert: Omit<Photo, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<Photo, 'id' | 'created_at'>>
        Relationships: [
          {
            foreignKeyName: 'photos_series_id_fkey'
            columns: ['series_id']
            referencedRelation: 'series'
            referencedColumns: ['id']
          },
        ]
      }
      profile: {
        Row: Pick<Profile, keyof Profile>
        Insert: never
        Update: Partial<Pick<Profile, 'avatar_path' | 'updated_at'>>
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
  }
}
