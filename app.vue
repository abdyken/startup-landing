<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const heroRef = ref(null)

const navLinks = [
  { href: '#flow', label: '3AM flow' },
  { href: '#track', label: 'Track' },
  { href: '#calm-answers', label: 'Calm answers' },
  { href: '#partner-sync', label: 'Partner sync' },
  { href: '#faq', label: 'FAQ' },
]

const flowSteps = [
  {
    time: '3:07',
    title: 'Baby wakes',
    copy: 'The room is dark. You need the next step, not a whole app.',
  },
  {
    time: '3:09',
    title: 'One tap logs it',
    copy: 'Feed, sleep, or diaper is captured without menus or bright screens.',
  },
  {
    time: '3:14',
    title: 'Back to surviving',
    copy: 'The log is there for morning, and you can keep the night quiet.',
  },
]

const trackers = [
  { label: 'Feed timer', value: '12 min', note: 'Left side running' },
  { label: 'Last feed', value: '2h 05m', note: 'Bottle, 70 ml' },
  { label: 'Diaper', value: 'Wet', note: 'Logged 4:03' },
  { label: 'Sleep', value: '38 min', note: 'Started 3:31' },
  { label: 'Daily totals', value: '6 feeds', note: '3 diapers, 4 naps' },
]

const notAnother = [
  'Not milestone spam',
  'Not endless charts',
  'Not chaotic AI answers',
  'Just the night-shift basics',
]

const faqs = [
  {
    question: 'Is this medical advice?',
    answer:
      'No. Lullaby gives general, bounded reassurance and clear prompts for when to contact your pediatrician. It does not diagnose, treat, or replace professional care.',
  },
  {
    question: 'What can I track?',
    answer:
      'The first version focuses on feeds, sleep, diapers, last events, and daily totals. The goal is the useful night-shift minimum.',
  },
  {
    question: 'Can I share with my partner?',
    answer:
      'Yes. Partner sync is core to the product, so both caregivers can see what happened without waking each other for a recap.',
  },
  {
    question: 'Is it for newborns only?',
    answer:
      'Lullaby is designed for 0-12 month baby care, with the newborn night shift as the strongest first focus.',
  },
  {
    question: 'When is it launching?',
    answer:
      'The launch date is not public yet. Join the waitlist to get early access when the first beta is ready.',
  },
]

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const interpolate = (start, end, progress) => start + (end - start) * progress
let cleanupHeroScroll = () => {}

onMounted(() => {
  const hero = heroRef.value
  const root = document.documentElement
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const mobileQuery = window.matchMedia('(max-width: 640px)')

  let animationFrame = 0
  let isListening = false

  const setStaticHero = () => {
    root.style.setProperty('--hero-scale', '1')
    root.style.setProperty('--hero-radius', '0px')
    root.style.setProperty('--hero-height', '100svh')
  }

  const updateHeroVars = () => {
    animationFrame = 0

    if (!hero) {
      return
    }

    const viewportHeight = window.innerHeight || 1
    const scrollRange = Math.max(hero.offsetHeight - viewportHeight, viewportHeight * 0.75)
    const progress = clamp(-hero.getBoundingClientRect().top / scrollRange, 0, 1)
    const isMobile = mobileQuery.matches

    const scale = interpolate(1, isMobile ? 0.94 : 0.85, progress)
    const radius = interpolate(0, isMobile ? 28 : 48, progress)
    const height = interpolate(100, isMobile ? 82 : 62.5, progress)

    root.style.setProperty('--hero-scale', scale.toFixed(3))
    root.style.setProperty('--hero-radius', `${radius.toFixed(1)}px`)
    root.style.setProperty('--hero-height', `${height.toFixed(1)}svh`)
  }

  const requestHeroUpdate = () => {
    if (animationFrame || reducedMotionQuery.matches) {
      return
    }

    animationFrame = window.requestAnimationFrame(updateHeroVars)
  }

  const addScrollListeners = () => {
    if (isListening) {
      return
    }

    isListening = true
    window.addEventListener('scroll', requestHeroUpdate, { passive: true })
    window.addEventListener('resize', requestHeroUpdate)
    updateHeroVars()
  }

  const removeScrollListeners = () => {
    if (!isListening) {
      return
    }

    isListening = false
    window.removeEventListener('scroll', requestHeroUpdate)
    window.removeEventListener('resize', requestHeroUpdate)
  }

  const syncMotionPreference = () => {
    if (reducedMotionQuery.matches) {
      removeScrollListeners()
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
        animationFrame = 0
      }
      setStaticHero()
      return
    }

    addScrollListeners()
  }

  syncMotionPreference()
  reducedMotionQuery.addEventListener('change', syncMotionPreference)
  mobileQuery.addEventListener('change', requestHeroUpdate)

  cleanupHeroScroll = () => {
    removeScrollListeners()
    reducedMotionQuery.removeEventListener('change', syncMotionPreference)
    mobileQuery.removeEventListener('change', requestHeroUpdate)

    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame)
    }

    setStaticHero()
  }
})

onBeforeUnmount(() => {
  cleanupHeroScroll()
})
</script>

<template>
  <div class="site-shell">
    <header class="site-nav">
      <a href="#top" class="brand" aria-label="Lullaby home">
        <span class="brand-mark" aria-hidden="true"></span>
        <span>Lullaby</span>
      </a>

      <nav class="nav-links" aria-label="Primary">
        <a v-for="link in navLinks" :key="link.href" :href="link.href">
          {{ link.label }}
        </a>
      </nav>

      <a class="nav-cta" href="#waitlist">Join waitlist</a>
    </header>

    <main id="top">
      <section ref="heroRef" class="hero" aria-labelledby="hero-heading">
        <div class="hero-sticky">
          <div class="hero-shrink-stage">
            <span class="hero-ghost" aria-hidden="true">03:00</span>

            <div class="hero-inner">
              <div class="hero-copy">
                <p class="eyebrow">For the newborn night shift</p>
                <h1 id="hero-heading">The 3AM companion for newborn nights</h1>
                <p class="hero-subcopy">
                  Track feeds, sleep, and diapers one-handed in the dark - and get calm
                  answers when "is this normal?" hits.
                </p>
                <a class="primary-button" href="#waitlist">Join the waitlist</a>
                <p class="microcopy">Built for exhausted new parents, not perfect routines.</p>
              </div>

              <div class="hero-device" aria-label="Lullaby phone preview">
                <div class="phone phone-hero">
                  <div class="phone-top">
                    <span>3:12</span>
                    <span>Night mode</span>
                  </div>
                  <div class="phone-main">
                    <p class="phone-kicker">Tonight</p>
                    <h2>Feed running</h2>
                    <div class="timer">12:08</div>
                    <div class="quick-actions" aria-label="Quick logging actions">
                      <span>Feed</span>
                      <span>Sleep</span>
                      <span>Diaper</span>
                    </div>
                  </div>
                  <div class="phone-note">
                    <span>Last feed</span>
                    <strong>2h ago</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="flow" class="flow section motion-ready">
        <span class="section-word" aria-hidden="true">FLOW</span>
        <div class="container">
          <div class="section-heading narrow">
            <p class="eyebrow">3AM flow</p>
            <h2>Three small steps when the night feels too big.</h2>
          </div>

          <div class="flow-grid">
            <article v-for="step in flowSteps" :key="step.title" class="flow-step">
              <span class="flow-time">{{ step.time }}</span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.copy }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="track" class="track section motion-ready">
        <span class="section-word section-word-right" aria-hidden="true">TRACK</span>
        <div class="container split">
          <div class="product-stage">
            <div class="track-card" aria-label="Tracking preview">
              <div class="track-card-head">
                <span>3:41 AM</span>
                <span>Updated just now</span>
              </div>
              <div class="tracker-list">
                <div v-for="item in trackers" :key="item.label" class="tracker-row">
                  <span>{{ item.label }}</span>
                  <strong>{{ item.value }}</strong>
                  <small>{{ item.note }}</small>
                </div>
              </div>
            </div>

            <div class="mini-handoff" aria-label="Morning handoff preview">
              <span>Morning handoff</span>
              <strong>Everything from the night, already there.</strong>
            </div>
          </div>

          <div class="section-heading">
            <p class="eyebrow">Track</p>
            <h2>The basics, reachable with one thumb.</h2>
            <p>
              Lullaby keeps the night log compact: feed timer, last feed, diaper,
              sleep, and daily totals. No dashboard clutter when everyone needs quiet.
            </p>
          </div>
        </div>
      </section>

      <section id="calm-answers" class="answers section motion-ready">
        <span class="section-word" aria-hidden="true">CALM</span>
        <div class="container split split-reverse">
          <article class="answer-card" aria-label="Calm answer example">
            <div class="answer-question">
              <p class="answer-label">Question</p>
              <h3>Is green poop normal?</h3>
            </div>

            <div class="answer-stack">
              <div class="answer-block">
                <strong>Likely normal</strong>
                <p>
                  Green poop can happen with normal digestion, feeding changes, or
                  iron in formula. If your baby is otherwise well, it is often not urgent.
                </p>
              </div>
              <div class="answer-block">
                <strong>What to try now</strong>
                <p>Check feeding, hydration, and whether anything changed today.</p>
              </div>
              <div class="answer-block caution">
                <strong>Call doctor if...</strong>
                <p>
                  There is blood, fever, repeated vomiting, dehydration, severe
                  fussiness, or your baby seems unlike themselves.
                </p>
              </div>
            </div>
          </article>

          <div class="section-heading">
            <p class="eyebrow">Calm answers</p>
            <h2>Reassurance with edges.</h2>
            <p>
              Not an open-ended chatbot spiral. Lullaby gives a grounded explanation,
              one next thing to check, and a clear line for when to call your doctor.
            </p>
          </div>
        </div>
      </section>

      <section id="partner-sync" class="partner section motion-ready">
        <div class="container partner-panel">
          <div class="section-heading narrow">
            <p class="eyebrow">Partner sync</p>
            <h2>Share the night shift without waking each other.</h2>
          </div>

          <div class="sync-moment" aria-label="Partner sync notification example">
            <span class="sync-dot" aria-hidden="true"></span>
            <div>
              <p>Bottle logged at 4:12 by your partner.</p>
              <small>You can sleep through the recap.</small>
            </div>
          </div>
        </div>
      </section>

      <section id="waitlist" class="final-cta section">
        <div class="container final-inner">
          <div class="section-heading narrow">
            <p class="eyebrow">Early access</p>
            <h2>Built for the nights no one prepared you for.</h2>
            <p>
              Lullaby is intentionally narrow: the night-shift basics, kept calm.
            </p>
          </div>

          <ul class="not-list" aria-label="What Lullaby keeps out">
            <li v-for="item in notAnother" :key="item">{{ item }}</li>
          </ul>

          <a class="primary-button" href="mailto:hello@lullaby.app?subject=Lullaby%20waitlist">
            Join waitlist
          </a>
        </div>
      </section>

      <section id="faq" class="faq section">
        <div class="container">
          <div class="section-heading narrow">
            <p class="eyebrow">FAQ</p>
            <h2>Quiet answers before launch.</h2>
          </div>

          <div class="faq-list">
            <details v-for="faq in faqs" :key="faq.question" class="faq-item">
              <summary>{{ faq.question }}</summary>
              <p>{{ faq.answer }}</p>
            </details>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>Lullaby is not medical advice. Always contact your healthcare provider with medical concerns.</p>
      <span>© 2026 Lullaby</span>
    </footer>
  </div>
</template>
