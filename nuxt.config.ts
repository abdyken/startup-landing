export default defineNuxtConfig({
  compatibilityDate: '2026-06-11',
  css: ['~/assets/css/main.css'],
  // Public Supabase credentials. Nuxt maps NUXT_PUBLIC_SUPABASE_URL ->
  // public.supabaseUrl and NUXT_PUBLIC_SUPABASE_ANON_KEY -> public.supabaseAnonKey
  // at runtime. The anon key is public by design; RLS guards the table.
  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
    },
  },
  app: {
    head: {
      title: 'Lullaby - the 3AM companion for newborn nights',
      meta: [
        {
          name: 'description',
          content:
            'Lullaby helps exhausted new parents track feeds, sleep, and diapers one-handed in the dark, with calm bounded reassurance and partner sync.',
        },
      ],
      // Lock the page background to the cream tone before main.css parses so a
      // refresh never flashes white behind the hero video.
      style: [{ innerHTML: 'html{background-color:#FAF6F0}' }],
      // Mark the document as loading before first paint so the above-the-fold
      // hero + navbar start from their dimmed entrance state (see main.css).
      // This is a no-op without JS, so SSR content stays fully visible.
      script: [
        {
          innerHTML: "document.documentElement.classList.add('is-loading')",
          tagPosition: 'head',
        },
      ],
    },
  },
})
