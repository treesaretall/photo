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

export interface Database {
  public: {
    Tables: {
      series: {
        Row: Series
        Insert: Omit<Series, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<Series, 'id' | 'created_at'>>
      }
      photos: {
        Row: Photo
        Insert: Omit<Photo, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<Photo, 'id' | 'created_at'>>
      }
    }
  }
}
