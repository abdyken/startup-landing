export default defineNuxtConfig({
  compatibilityDate: '2026-06-11',
  modules: ['@vercel/analytics'],
  css: ['~/assets/css/main.css'],
  // The dev machine's inotify watcher limit (fs.inotify.max_user_watches) is
  // exhausted, so native file watching throws ENOSPC on startup. Poll instead
  // of relying on kernel watchers. To revert: raise the kernel limit with
  // `sudo sysctl fs.inotify.max_user_watches=524288` and delete this block.
  vite: {
    server: {
      watch: { usePolling: true, interval: 300 },
    },
  },
  watchers: {
    chokidar: { usePolling: true, interval: 300 },
  },
  runtimeConfig: {
    public: {
      supportEmail: '240103091@sdu.edu.kz',
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
      // Fonts for the phone mockup component only. The font-family is applied
      // strictly inside `.lb-phone`, so landing typography is untouched.
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700;800;900&display=swap',
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
