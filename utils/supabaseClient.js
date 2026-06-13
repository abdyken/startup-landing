import { createClient } from '@supabase/supabase-js'

// Single shared anon client for the landing page. The waitlist table is
// insert-only for the `anon` role (RLS), so this client can add emails but
// cannot read the list back. Created lazily and memoized so repeat submits
// reuse one instance.
let client = null

export function getSupabaseClient(url, anonKey) {
  if (!client) {
    client = createClient(url, anonKey)
  }

  return client
}
