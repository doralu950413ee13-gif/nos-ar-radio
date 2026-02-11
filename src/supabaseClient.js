import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xwgwznsihjbkiseozfnx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Z3d6bnNpaGpia2lzZW96Zm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTEzNDEsImV4cCI6MjA4NTg2NzM0MX0.GDlSjzgFobhsOAOsXlglEMkscbe3lPR4QtZpidliyJA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)