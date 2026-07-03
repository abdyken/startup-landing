<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  eyebrow: {
    type: String,
    required: true,
  },
  intro: {
    type: String,
    required: true,
  },
  sections: {
    type: Array,
    required: true,
  },
  updated: {
    type: String,
    default: 'July 3, 2026',
  },
})
</script>

<template>
  <div class="site-shell legal-page">
    <header class="site-nav legal-nav">
      <NuxtLink to="/" class="brand" aria-label="Lullaby home">
        <span class="brand-mark" aria-hidden="true"></span>
        <span>Lullaby</span>
      </NuxtLink>

      <nav class="nav-links legal-nav-links" aria-label="Legal pages">
        <NuxtLink to="/privacy">Privacy</NuxtLink>
        <NuxtLink to="/terms">Terms</NuxtLink>
      </nav>

      <NuxtLink class="nav-cta" to="/#waitlist">Join the waitlist</NuxtLink>
    </header>

    <main class="legal-main">
      <section class="legal-hero container" aria-labelledby="legal-heading">
        <p class="eyebrow">{{ props.eyebrow }}</p>
        <h1 id="legal-heading">{{ props.title }}</h1>
        <p class="legal-intro">{{ props.intro }}</p>
        <p class="legal-updated">Last updated {{ props.updated }}</p>
      </section>

      <section class="legal-document container" aria-label="Legal information">
        <article
          v-for="section in props.sections"
          :key="section.heading"
          class="legal-section"
        >
          <h2>{{ section.heading }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">
            {{ paragraph }}
          </p>
        </article>
      </section>
    </main>

    <footer class="legal-footer container">
      <NuxtLink to="/" class="brand footer-brand" aria-label="Lullaby home">
        <span class="brand-mark" aria-hidden="true"></span>
        <span>Lullaby</span>
      </NuxtLink>
      <nav aria-label="Footer legal links">
        <NuxtLink to="/privacy">Privacy</NuxtLink>
        <NuxtLink to="/terms">Terms</NuxtLink>
        <NuxtLink to="/#waitlist">Waitlist</NuxtLink>
      </nav>
      <p>Lullaby is not medical diagnosis. Contact a pediatrician or emergency services for health concerns.</p>
    </footer>
  </div>
</template>
