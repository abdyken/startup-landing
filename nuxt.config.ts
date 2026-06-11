export default defineNuxtConfig({
  compatibilityDate: '2026-06-11',
  css: ['~/assets/css/main.css'],
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
    },
  },
})
