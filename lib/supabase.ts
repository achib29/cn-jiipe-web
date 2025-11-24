import { createClient } from '@supabase/supabase-js'

// GANTI DENGAN DATA DARI DASHBOARD SUPABASE ANDA
const supabaseUrl = 'https://isjpqgefvomitlovfldb.supabase.co' // Project URL
const supabaseKey = 'sb_publishable_12xC2RbNgC4LkXOpmrgpDw_w-dItBzM' // API Key (anon/public)

export const supabase = createClient(supabaseUrl, supabaseKey)