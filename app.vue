<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const heroRef = ref(null)
const activeProductMomentIndex = ref(0)

const navLinks = [
  { href: '#flow', label: '3AM flow' },
  { href: '#night-log', label: 'Night log' },
  { href: '#partner-sync', label: 'Partner sync' },
  { href: '#faq', label: 'FAQ' },
]

const flowSteps = [
  {
    time: '3:07',
    title: 'Baby wakes',
    copy: 'Dim room. One hand free. No bright dashboard, just the last thing that happened.',
    fragments: ['Last feed 2h ago', 'Night mode', 'One hand free'],
  },
  {
    time: '3:09',
    title: 'Log the basics',
    copy: 'Start the feed, choose a side, add bottle amount, and tap wet or dirty before you forget.',
    fragments: ['Left side', '70 ml', 'Wet'],
  },
  {
    time: '3:14',
    title: 'Handoff is ready',
    copy: 'Last feed, diaper, and sleep are already there for your partner when morning starts.',
    fragments: ['Partner will see this', 'Last feed saved', 'Sleep ready'],
  },
]

const productMoments = [
  {
    key: 'feed',
    eyebrow: 'Feed',
    title: 'Feed started',
    copy:
      'Start a feed with one thumb, keep the side visible, and leave bottle 70 ml one tap away.',
    phoneTitle: 'Feed started',
    timer: '12:08',
    status: 'Left side',
    actions: ['Left', 'Right', '70 ml'],
    noteLabel: 'Last feed',
    noteValue: '2h ago',
    details: [
      { label: 'Bottle', value: '70 ml' },
      { label: 'Right next', value: 'Ready' },
    ],
  },
  {
    key: 'sleep',
    eyebrow: 'Sleep',
    title: 'Sleep started',
    copy:
      'Mark sleep without building a routine. Start time, last nap, and wake window stay visible.',
    phoneTitle: 'Sleep started',
    timer: '3:31',
    status: 'Started 3:31',
    actions: ['Asleep', 'Wake', 'Note'],
    noteLabel: 'Last nap',
    noteValue: '51 min ago',
    details: [
      { label: 'Wake window', value: '1h 20m' },
      { label: 'Today', value: '4 naps' },
    ],
  },
  {
    key: 'diaper',
    eyebrow: 'Diaper',
    title: 'Wet diaper logged',
    copy:
      'Tap wet or dirty once. Daily count is ready for the morning handoff.',
    phoneTitle: 'Wet logged',
    timer: '4:03',
    status: 'Wet',
    actions: ['Wet', 'Dirty', 'Both'],
    noteLabel: 'Daily count',
    noteValue: '3 today',
    details: [
      { label: 'Wet', value: '2' },
      { label: 'Dirty', value: '1' },
    ],
  },
  {
    key: 'sync',
    eyebrow: 'Partner sync',
    title: 'Morning recap is ready',
    copy:
      'Bottle logged at 4:12. Your partner will see it in the morning recap, with bounded guidance if a common newborn worry comes up.',
    phoneTitle: 'Morning recap',
    timer: '4:12',
    status: 'Bottle logged at 4:12',
    actions: ['Seen', 'Reply', 'Done'],
    noteLabel: 'Partner',
    noteValue: 'Will see this',
    anchors: ['calm-answers', 'partner-sync'],
    details: [
      { label: 'Morning recap', value: 'Ready' },
      { label: 'Bottle', value: '80 ml' },
    ],
    answer: {
      question: 'Common worry',
      response: 'Red flags. Call your pediatrician if needed.',
    },
  },
]

const activeProductMoment = computed(
  () => productMoments[activeProductMomentIndex.value] ?? productMoments[0],
)

const notAnother = [
  'Last feed saved',
  'Partner handoff ready',
  'No diagnosis',
  'One email only',
]

const faqs = [
  {
    question: 'Is this medical advice?',
    answer:
      'No. Lullaby is not a diagnosis and does not replace your pediatrician. It gives bounded guidance for common newborn worries and highlights red flags for when to call a doctor.',
  },
  {
    question: 'What can I log?',
    answer:
      'Feeds, breast side, bottle amount, sleep, wet or dirty diapers, and simple notes for the night.',
  },
  {
    question: 'Can I share the night log with my partner?',
    answer:
      'Yes. The goal is a quiet handoff: your partner can see last feed, diaper, sleep, and bottle logs without waking you.',
  },
  {
    question: 'What newborn worries are covered?',
    answer:
      'Common early worries like spit-up, hiccups, cluster feeding, gassiness, poop color, feeding often, and "is this normal?" moments - with clear boundaries and red flags.',
  },
  {
    question: 'When is it launching?',
    answer:
      'Private beta first. Join the waitlist and you will get one email when the first newborn-night build opens.',
  },
]

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const interpolate = (start, end, progress) => start + (end - start) * progress
let cleanupHeroScroll = () => {}
let cleanupSectionReveal = () => {}
let cleanupProductStory = () => {}

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

onMounted(() => {
  const root = document.documentElement
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const revealItems = Array.from(document.querySelectorAll('.reveal-item'))
  let observer = null

  const revealAll = () => {
    revealItems.forEach((item) => item.classList.add('is-revealed'))
  }

  root.classList.add('reveal-ready')

  if (!('IntersectionObserver' in window) || reducedMotionQuery.matches) {
    revealAll()
  } else {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.classList.add('is-revealed')
          observer?.unobserve(entry.target)
        })
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.14,
      },
    )

    revealItems.forEach((item) => observer.observe(item))
  }

  const syncRevealMotionPreference = () => {
    if (!reducedMotionQuery.matches) {
      return
    }

    observer?.disconnect()
    observer = null
    revealAll()
  }

  reducedMotionQuery.addEventListener('change', syncRevealMotionPreference)

  cleanupSectionReveal = () => {
    observer?.disconnect()
    reducedMotionQuery.removeEventListener('change', syncRevealMotionPreference)
    root.classList.remove('reveal-ready')
  }
})

onMounted(() => {
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const momentItems = Array.from(document.querySelectorAll('.story-moment'))
  let observer = null

  if (!('IntersectionObserver' in window) || reducedMotionQuery.matches) {
    activeProductMomentIndex.value = 0
  } else {
    observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!activeEntry) {
          return
        }

        const nextIndex = Number(activeEntry.target.dataset.momentIndex)

        if (Number.isFinite(nextIndex)) {
          activeProductMomentIndex.value = nextIndex
        }
      },
      {
        rootMargin: '-32% 0px -36% 0px',
        threshold: [0.15, 0.35, 0.58, 0.78],
      },
    )

    momentItems.forEach((item) => observer.observe(item))
  }

  const syncProductMotionPreference = () => {
    if (!reducedMotionQuery.matches) {
      return
    }

    observer?.disconnect()
    observer = null
    activeProductMomentIndex.value = 0
  }

  reducedMotionQuery.addEventListener('change', syncProductMotionPreference)

  cleanupProductStory = () => {
    observer?.disconnect()
    reducedMotionQuery.removeEventListener('change', syncProductMotionPreference)
  }
})

onBeforeUnmount(() => {
  cleanupHeroScroll()
  cleanupSectionReveal()
  cleanupProductStory()
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

      <a class="nav-cta" href="#waitlist">Join the waitlist</a>
    </header>

    <main id="top">
      <section ref="heroRef" class="hero" aria-labelledby="hero-heading">
        <div class="hero-sticky">
          <div class="hero-shrink-stage">
            <span class="hero-ghost" aria-hidden="true">03:00</span>

            <div class="hero-inner">
              <div class="hero-copy">
                <p class="eyebrow">For the newborn night shift</p>
                <h1 id="hero-heading">One-handed logs for 3AM feeds, diapers, and sleep</h1>
                <p class="hero-subcopy">
                  In the dim room, save breast side, bottle amount, wet or dirty
                  diaper, and sleep without waking yourself up. For common newborn
                  worries, Lullaby shows bounded guidance, clear red flags, and when
                  to call your pediatrician - not a diagnosis.
                </p>
                <a class="primary-button" href="#waitlist">Join the waitlist</a>
                <p class="microcopy">Private beta. One email when the newborn-night build opens.</p>
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
            <h2>A small night record for the wake-ups you barely remember.</h2>
          </div>

          <div class="flow-grid">
            <article
              v-for="(step, index) in flowSteps"
              :key="step.title"
              class="flow-step reveal-item"
              :style="{ '--reveal-delay': `${index * 80}ms` }"
            >
              <span class="flow-marker" aria-hidden="true"></span>
              <div class="flow-step-head">
                <span class="flow-time">{{ step.time }}</span>
                <span class="flow-index">0{{ index + 1 }}</span>
              </div>
              <div class="flow-step-body">
                <h3>{{ step.title }}</h3>
                <p>{{ step.copy }}</p>
              </div>
              <ul class="flow-fragments" aria-label="Night log fragments">
                <li v-for="fragment in step.fragments" :key="fragment">{{ fragment }}</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section id="night-log" class="product-story section motion-ready" aria-labelledby="story-heading">
        <span class="section-word section-word-right" aria-hidden="true">NIGHT</span>
        <div class="container product-story-grid">
          <div class="story-visual reveal-item">
            <div class="story-phone-stage" aria-label="Lullaby product preview">
              <div class="phone story-phone" :class="`story-phone-${activeProductMoment.key}`">
                <div class="phone-top">
                  <span>3:12</span>
                  <span>Night mode</span>
                </div>
                <Transition name="phone-state" mode="out-in">
                  <div :key="activeProductMoment.key" class="story-phone-content">
                    <div class="phone-main story-phone-main">
                      <p class="phone-kicker">{{ activeProductMoment.eyebrow }}</p>
                      <h2>{{ activeProductMoment.phoneTitle }}</h2>
                      <div class="timer">{{ activeProductMoment.timer }}</div>
                      <p class="story-phone-status">{{ activeProductMoment.status }}</p>
                      <div class="quick-actions" aria-label="Quick logging actions">
                        <span v-for="action in activeProductMoment.actions" :key="action">
                          {{ action }}
                        </span>
                      </div>
                    </div>
                    <div class="phone-note">
                      <span>{{ activeProductMoment.noteLabel }}</span>
                      <strong>{{ activeProductMoment.noteValue }}</strong>
                    </div>
                    <div class="story-phone-details">
                      <div v-for="detail in activeProductMoment.details" :key="detail.label">
                        <span>{{ detail.label }}</span>
                        <strong>{{ detail.value }}</strong>
                      </div>
                    </div>
                    <div v-if="activeProductMoment.answer" class="story-phone-answer">
                      <span>{{ activeProductMoment.answer.question }}</span>
                      <p>{{ activeProductMoment.answer.response }}</p>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <div class="story-copy section-heading reveal-item">
            <p class="eyebrow">Track</p>
            <h2 id="story-heading">Last feed, diaper, sleep. Ready by morning.</h2>
            <p>
              Keep the night log short: feed, sleep, wet or dirty diaper, partner
              handoff, and bounded help for a common newborn worry.
            </p>
          </div>

          <div class="story-moments">
            <article
              v-for="(moment, index) in productMoments"
              :key="moment.key"
              class="story-moment reveal-item"
              :class="{ 'is-active': activeProductMomentIndex === index }"
              :data-moment-index="index"
              :style="{ '--reveal-delay': `${index * 70}ms` }"
              :aria-current="activeProductMomentIndex === index ? 'step' : undefined"
            >
              <span
                v-for="anchor in moment.anchors"
                :id="anchor"
                :key="anchor"
                class="section-anchor"
                aria-hidden="true"
              ></span>
              <span class="story-count">0{{ index + 1 }}</span>
              <div>
                <p class="eyebrow">{{ moment.eyebrow }}</p>
                <h3>{{ moment.title }}</h3>
                <p>{{ moment.copy }}</p>
              </div>

              <div v-if="moment.key === 'sync'" class="sync-moment story-sync">
                <span class="sync-dot" aria-hidden="true"></span>
                <div>
                  <p>Bottle logged at 4:12.</p>
                  <small>Partner will see this in the morning recap.</small>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="waitlist" class="final-cta section">
        <div class="container final-inner reveal-item">
          <div class="section-heading narrow">
            <p class="eyebrow">Early access</p>
            <h2>Get the first newborn-night build.</h2>
            <p>
              For parents logging feeds, diapers, sleep, and partner handoffs at
              3AM. One email when the private beta opens.
            </p>
          </div>

          <ul class="not-list" aria-label="What Lullaby keeps out">
            <li v-for="item in notAnother" :key="item">{{ item }}</li>
          </ul>

          <form class="waitlist-form" @submit.prevent aria-label="Join the Lullaby waitlist">
            <label class="sr-only" for="waitlist-email">Email address</label>
            <input
              id="waitlist-email"
              class="waitlist-input"
              type="email"
              name="email"
              placeholder="your@email.com"
              autocomplete="email"
              inputmode="email"
              required
            />
            <button class="primary-button waitlist-submit" type="submit">
              Join the waitlist
            </button>
          </form>
          <p class="cta-note">Bounded newborn guidance. Not medical diagnosis.</p>
          <p class="cta-helper">One email when the private beta opens. No spam.</p>
        </div>
      </section>

      <section id="faq" class="faq section">
        <div class="container">
          <div class="section-heading narrow">
            <p class="eyebrow">FAQ</p>
            <h2>Questions parents ask before 3AM.</h2>
            <p>
              Lullaby is built for simple night logging and bounded newborn guidance
              - not diagnosis, not endless charts.
            </p>
          </div>

          <div class="faq-list">
            <details
              v-for="(faq, index) in faqs"
              :key="faq.question"
              class="faq-item reveal-item"
              :style="{ '--reveal-delay': `${index * 55}ms` }"
            >
              <summary>{{ faq.question }}</summary>
              <p>{{ faq.answer }}</p>
            </details>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>Lullaby is not medical diagnosis. Always contact your pediatrician or healthcare provider with medical concerns.</p>
      <span>© 2026 Lullaby</span>
    </footer>
  </div>
</template>
