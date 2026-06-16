<script setup>
import { computed, ref, watch } from 'vue'

/**
 * Scroll-driven phone mockup for the storytelling section.
 * Ported from .reference/lullaby-phone-mockup.html (the DROP-IN COMPONENT
 * parts only: .lb-phone markup, #lb-styles, and the #lb-script state logic).
 *
 * Drives entirely off the reactive `state` prop — no window globals, no new
 * scroll system. The parent already tracks the active story step reactively.
 */
const props = defineProps({
  state: {
    type: String,
    default: 'sleep',
  },
})

// story-step id -> state key. Keeps the parent free to pass its own ids.
const ALIAS = {
  'partner-sync': 'partner',
  partner_sync: 'partner',
  partnersync: 'partner',
  sync: 'partner',
}

// Orb-state eyebrow icons.
const STATE_ICON = {
  asleep:
    '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg>',
  live:
    '<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>',
  check:
    '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
}

// SVG icons for timeline dots, keyed by event kind.
const ICON = {
  feed:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 2h6M10 2v3.5a4 4 0 0 0-1.2 2.8L8 19a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3l-.8-10.7A4 4 0 0 0 14 5.5V2" stroke="#FF7A3D" stroke-width="1.9"/></svg>',
  sleep:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke="#5560C6" stroke-width="1.9"/></svg>',
  diaper:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 7h18l-1.5 4.5A8 8 0 0 1 12 17a8 8 0 0 1-7.5-5.5L3 7Z" stroke="#23B79E" stroke-width="1.9"/></svg>',
}
const TINT = {
  feed: 'var(--lb-feed-tint)',
  sleep: 'var(--lb-sleep-tint)',
  diaper: 'var(--lb-diaper-tint)',
}
const CARE = { Mom: '#FF9E5E', Dad: '#5560C6' }

// State data — Mia/Lullaby copy plus render metadata.
const STATES = {
  sleep: {
    sky: 'night', accent: 'sleep', status: 'Asleep', statusIcon: 'asleep',
    core: 'timer', timer: '1h 12m', progress: 0.36,
    title: 'Sleep started', text: 'Started 4:12 · we’ll keep the night quiet',
    action: 'Wake baby', activeQuick: 'sleep',
    timeline: [
      { time: 'Now', kind: 'sleep', label: 'Sleep running', by: null },
      { time: '3:10', kind: 'feed', label: 'Feed · left, 11m', by: 'Mom' },
    ],
  },
  feed: {
    sky: 'day', accent: 'feed', status: 'Feeding', statusIcon: 'live',
    core: 'timer', timer: '04m', progress: 0.12,
    title: 'Feed started', text: 'Left side · 4 min in',
    action: 'End feed', activeQuick: 'feed',
    timeline: [
      { time: 'Now', kind: 'feed', label: 'Feed in progress', by: 'Mom' },
      { time: '3:48', kind: 'diaper', label: 'Diaper · wet', by: 'Dad' },
    ],
  },
  diaper: {
    sky: 'day', accent: 'diaper', status: 'Just logged', statusIcon: 'check',
    core: 'check', timer: 'Logged', progress: 1,
    title: 'Diaper logged', text: 'Wet · added to tonight',
    action: 'Done', activeQuick: 'diaper',
    timeline: [
      { time: 'Now', kind: 'diaper', label: 'Diaper logged', by: 'Dad' },
      { time: '3:10', kind: 'feed', label: 'Feed · left, 11m', by: 'Mom' },
    ],
  },
  partner: {
    sky: 'dusk', accent: 'partner', status: 'Synced', statusIcon: 'live',
    core: 'avatars', timer: 'Live', progress: 1,
    title: 'Dad handled the last wake-up', text: 'Feed and diaper synced to Mia’s night log',
    action: 'View handoff', activeQuick: null,
    timeline: [
      { time: '3:48', kind: 'diaper', label: 'Dad shared logs', by: 'Dad' },
      { time: '3:10', kind: 'feed', label: 'Mom shared logs', by: 'Mom' },
    ],
  },
}

const R = 79
const C = 2 * Math.PI * R // ring circumference

const QUICK = [
  { q: 'feed', label: 'Feed', cls: 'feed' },
  { q: 'sleep', label: 'Sleep', cls: 'sleep' },
  { q: 'diaper', label: 'Diaper', cls: 'diaper' },
  { q: 'pump', label: 'Pump', cls: 'pump' },
]

const resolvedKey = computed(() => {
  const id = props.state
  const key = ALIAS[id] || id
  return STATES[key] ? key : 'sleep'
})

// Displayed key trails resolvedKey by one fade, mirroring the prototype's
// fade-out -> swap -> fade-in sequence so the screen never hard-cuts.
const displayedKey = ref(resolvedKey.value)
const swapping = ref(false)
let swapTimer = null

watch(resolvedKey, (next) => {
  if (next === displayedKey.value) return
  swapping.value = true
  if (swapTimer) clearTimeout(swapTimer)
  swapTimer = setTimeout(() => {
    displayedKey.value = next
    // next frame -> fade back in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        swapping.value = false
      })
    })
  }, 180)
})

const s = computed(() => STATES[displayedKey.value])
const dashOffset = computed(() => C * (1 - s.value.progress))

const careColor = (by) => CARE[by] || '#A8A2B8'
</script>

<template>
  <div
    class="lb-phone"
    :class="{ 'is-swapping': swapping }"
    :data-state="displayedKey"
    aria-hidden="true"
  >
    <div class="lb-viewport">
    <div class="lb-statusbar">
      <span>3:48</span>
      <span class="lb-sb-right">
        <svg width="16" height="11" viewBox="0 0 17 12"><rect x="0" y="7" width="3" height="5" rx="1" fill="#2E2A40" /><rect x="4.5" y="4.5" width="3" height="7.5" rx="1" fill="#2E2A40" /><rect x="9" y="2" width="3" height="10" rx="1" fill="#2E2A40" /><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#2E2A40" /></svg>
        <svg width="21" height="11" viewBox="0 0 24 12"><rect x="1" y="1" width="20" height="10" rx="3" stroke="#2E2A40" stroke-width="1.2" opacity=".5" fill="none" /><rect x="3" y="3" width="15" height="6" rx="1.5" fill="#2E2A40" /><rect x="22" y="4" width="1.5" height="4" rx="1" fill="#2E2A40" opacity=".5" /></svg>
      </span>
    </div>

    <div class="lb-screen">
      <!-- STATIC: baby header -->
      <div class="lb-head">
        <svg class="lb-av" viewBox="0 0 50 50" fill="none">
          <path d="M25 3c11 0 21 7 21 21 0 14-9 23-21 23S4 38 4 24C4 10 14 3 25 3Z" fill="url(#lbBg1)" />
          <path d="M19 1c2 2 2 5 0 7-3-1-5-4-4-6 1-1 3-1 4-1Z" fill="#FFB07A" />
          <circle cx="19" cy="25" r="2.4" fill="#5A3A28" /><circle cx="31" cy="25" r="2.4" fill="#5A3A28" />
          <path d="M21 32c2 2 6 2 8 0" stroke="#5A3A28" stroke-width="2" stroke-linecap="round" />
          <circle cx="15" cy="30" r="2.6" fill="#FF9E7E" opacity=".5" /><circle cx="35" cy="30" r="2.6" fill="#FF9E7E" opacity=".5" />
          <defs><linearGradient id="lbBg1" x1="4" y1="3" x2="46" y2="47"><stop stop-color="#FFD9A8" /><stop offset="1" stop-color="#FF9E6B" /></linearGradient></defs>
        </svg>
        <div class="lb-meta">
          <div class="lb-name">Mia</div>
          <div class="lb-sub">7 weeks old</div>
        </div>
        <div class="lb-care">
          <span style="background:#FF9E5E">M</span>
          <span style="background:#5560C6">D</span>
          <span style="background:#23B79E">+</span>
        </div>
      </div>

      <!-- DYNAMIC: everything below swaps per scroll step -->
      <div class="lb-dyn">
        <!-- sky / orb hero -->
        <div
          class="lb-sky"
          :class="{ 'is-night': s.sky === 'night', 'is-dusk': s.sky === 'dusk' }"
        >
          <div class="lb-cloud lb-c1"></div>
          <div class="lb-cloud lb-c2"></div>
          <svg class="lb-star lb-s1" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7Z" /></svg>
          <svg class="lb-star lb-s2" width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7Z" /></svg>
          <svg class="lb-star lb-s3" width="7" height="7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7Z" /></svg>
          <svg class="lb-star lb-s4" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7Z" /></svg>

          <div class="lb-orb-wrap">
            <div class="lb-orb">
              <div class="lb-sun"></div>
              <svg class="lb-ring" viewBox="0 0 178 178">
                <circle class="lb-track" cx="89" cy="89" r="79" />
                <circle
                  class="lb-prog"
                  cx="89"
                  cy="89"
                  r="79"
                  :style="{ strokeDasharray: C, strokeDashoffset: dashOffset }"
                />
              </svg>
              <div class="lb-orb-core">
                <template v-if="s.core === 'check'">
                  <div class="lb-orb-check">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#23B79E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg>
                  </div>
                  <div class="lb-orb-state"><span v-html="STATE_ICON[s.statusIcon]"></span>{{ s.status }}</div>
                </template>
                <template v-else-if="s.core === 'avatars'">
                  <div class="lb-orb-pair">
                    <span style="background:#FF9E5E">M</span>
                    <span style="background:#5560C6">D</span>
                  </div>
                  <div class="lb-orb-state"><span v-html="STATE_ICON[s.statusIcon]"></span>{{ s.status }}</div>
                </template>
                <template v-else>
                  <div class="lb-orb-state"><span v-html="STATE_ICON[s.statusIcon]"></span>{{ s.status }}</div>
                  <div class="lb-orb-time">{{ s.timer }}</div>
                </template>
              </div>
            </div>
            <button class="lb-action" type="button" tabindex="-1"><span>{{ s.action }}</span></button>
          </div>
        </div>

        <!-- moment (title + text) -->
        <div class="lb-moment">
          <div class="lb-m-title">{{ s.title }}</div>
          <div class="lb-m-text">{{ s.text }}</div>
        </div>

        <!-- partner sync card (shown only in partner state) -->
        <div class="lb-sync">
          <div class="lb-sync-av">
            <span style="background:#FF9E5E">M</span>
            <span style="background:#5560C6">D</span>
          </div>
          <div class="lb-sync-tx">
            Both parents are up to date.
            <small>Mia’s night log is shared live</small>
          </div>
        </div>

        <!-- quick log -->
        <div class="lb-quick">
          <button
            v-for="q in QUICK"
            :key="q.q"
            class="lb-q"
            :class="[q.cls, { 'is-active': q.q === s.activeQuick }]"
            type="button"
            tabindex="-1"
          >
            <span class="lb-qi">
              <svg v-if="q.q === 'feed'" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 2h6M10 2v3.5a4 4 0 0 0-1.2 2.8L8 19a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3l-.8-10.7A4 4 0 0 0 14 5.5V2" stroke="#FF7A3D" stroke-width="1.9" stroke-linejoin="round" /><path d="M8.4 12h7.2" stroke="#FF7A3D" stroke-width="1.9" /></svg>
              <svg v-else-if="q.q === 'sleep'" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke="#5560C6" stroke-width="1.9" stroke-linejoin="round" /></svg>
              <svg v-else-if="q.q === 'diaper'" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 7h18l-1.5 4.5A8 8 0 0 1 12 17a8 8 0 0 1-7.5-5.5L3 7Z" stroke="#23B79E" stroke-width="1.9" stroke-linejoin="round" /><path d="M9 11c1 1.2 5 1.2 6 0" stroke="#23B79E" stroke-width="1.9" stroke-linecap="round" /></svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 21h10M8 21V11h8v10M6 11h12M9 11V7a3 3 0 0 1 6 0v4" stroke="#FFB12E" stroke-width="1.9" stroke-linejoin="round" /></svg>
            </span>
            <span class="lb-ql">{{ q.label }}</span>
          </button>
        </div>

        <!-- tonight timeline -->
        <div class="lb-tl-card">
          <div class="lb-tl-head"><h3>Tonight</h3><span class="lb-link">See all</span></div>
          <div>
            <div v-for="(it, i) in s.timeline" :key="i" class="lb-tl-item">
              <div class="lb-tl-time">{{ it.time }}</div>
              <div class="lb-tl-dot" :style="{ background: TINT[it.kind] || 'var(--lb-line)' }" v-html="ICON[it.kind] || ''"></div>
              <div class="lb-tl-body">
                <div class="lb-t1">{{ it.label }}</div>
                <div class="lb-t2">
                  <template v-if="it.by">
                    <span class="lb-who" :style="{ background: careColor(it.by) }">{{ it.by[0] }}</span>{{ it.by }}
                  </template>
                  <template v-else>On the clock</template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <img
      class="lb-frame"
      src="/images/iphone-15-mockup.png"
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  </div>
</template>

<style scoped>
/* All tokens live on the component root, NOT :root / body, so nothing leaks. */
.lb-phone {
  --lb-ink: #2e2a40;
  --lb-ink-soft: #736e86;
  --lb-ink-faint: #a8a2b8;
  --lb-bg: #fbf4ef; /* warm cream app background — stays cream in every state */
  --lb-surface: #ffffff;
  --lb-surface-2: #fbf6f2;
  --lb-line: #f0e8e2;

  --lb-feed: #ff7a3d;
  --lb-feed-2: #ff9e5e;
  --lb-feed-tint: #ffede0;
  --lb-sleep: #5560c6;
  --lb-sleep-2: #7c84da;
  --lb-sleep-tint: #e9ebfb;
  --lb-diaper: #23b79e;
  --lb-diaper-tint: #ddf5ef;

  --lb-shadow-soft: 0 22px 50px -18px rgba(60, 40, 30, 0.3);
  --lb-shadow-card: 0 10px 26px -14px rgba(60, 40, 30, 0.22);
  --lb-r-lg: 34px;
  --lb-r-md: 24px;
  --lb-r-sm: 16px;

  /* accent + caregiver colors driven by [data-state] below */
  --lb-accent: var(--lb-sleep);
  --lb-accent-tint: var(--lb-sleep-tint);
  --lb-mom: #ff9e5e;
  --lb-dad: #5560c6;

  /* The device is now the iPhone 15 mockup PNG. aspect-ratio locks the frame's
     proportions; the live screen lives in .lb-viewport, fitted to the PNG's
     transparent screen cutout, and the PNG overlays it via .lb-frame. */
  width: min(380px, 100%);
  aspect-ratio: 1419 / 2796;
  position: relative;
  flex-shrink: 0;
  font-family: 'Nunito', system-ui, sans-serif;
  color: var(--lb-ink);
  -webkit-tap-highlight-color: transparent;
}

/* the iPhone 15 bezel, overlaid above the screen content */
.lb-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

/* live screen window — matched to the PNG cutout: top/bottom 4.3%, sides 8.5% */
.lb-viewport {
  position: absolute;
  top: 4.3%;
  right: 8.5%;
  bottom: 4.3%;
  left: 8.5%;
  z-index: 1;
  background: var(--lb-bg);
  border-radius: 7% / 3.5%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.lb-phone :deep(*) {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* accent mapping per state */
.lb-phone[data-state='feed'] {
  --lb-accent: var(--lb-feed);
  --lb-accent-tint: var(--lb-feed-tint);
}
.lb-phone[data-state='sleep'] {
  --lb-accent: var(--lb-sleep);
  --lb-accent-tint: var(--lb-sleep-tint);
}
.lb-phone[data-state='diaper'] {
  --lb-accent: var(--lb-diaper);
  --lb-accent-tint: var(--lb-diaper-tint);
}
.lb-phone[data-state='partner'] {
  --lb-accent: var(--lb-sleep);
  --lb-accent-tint: var(--lb-sleep-tint);
}

.lb-statusbar {
  height: 38px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 26px 5px;
  font-size: 12.5px;
  font-weight: 800;
  flex-shrink: 0;
}
.lb-statusbar .lb-sb-right {
  display: flex;
  gap: 6px;
  align-items: center;
}

/* single, non-scrolling screen */
.lb-screen {
  padding: 2px 18px 12px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  overflow: hidden;
  flex: 1;
  min-height: 0;
}

/* the part that swaps on scroll; fades softly */
.lb-dyn {
  display: flex;
  flex-direction: column;
  gap: 9px;
  transition: opacity 0.32s ease, transform 0.32s ease;
}
.lb-phone.is-swapping .lb-dyn {
  opacity: 0;
  transform: translateY(6px);
}

/* baby header (static across states) */
.lb-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 2px 0;
}
.lb-av {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}
.lb-head .lb-meta {
  flex: 1;
}
.lb-head .lb-name {
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 1.05;
}
.lb-head .lb-sub {
  font-size: 12px;
  color: var(--lb-ink-soft);
  font-weight: 600;
}
.lb-care {
  display: flex;
}
.lb-care span {
  width: 29px;
  height: 29px;
  border-radius: 50%;
  border: 2.5px solid var(--lb-bg);
  margin-left: -9px;
  font-size: 10.5px;
  font-weight: 800;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lb-care span:first-child {
  margin-left: 0;
}

/* ===== SKY / ORB HERO — the signature ===== */
.lb-sky {
  position: relative;
  border-radius: var(--lb-r-lg);
  overflow: hidden;
  padding: 10px 18px 10px;
  background: linear-gradient(168deg, #ffe0b8 0%, #ffc9b0 42%, #f3d3ec 80%, #fbeff6 100%);
  box-shadow: var(--lb-shadow-card);
  transition: background 0.7s ease;
  flex-shrink: 0;
}
.lb-sky.is-night {
  background: linear-gradient(168deg, #3b3a74 0%, #4a4d9c 50%, #6e6fc2 100%);
}
.lb-sky.is-dusk {
  background: linear-gradient(168deg, #ede7fb 0%, #e7e9fc 48%, #dcf4ee 100%);
}

.lb-cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 40px;
  transition: opacity 0.6s;
}
.lb-sky.is-night .lb-cloud {
  opacity: 0;
}
.lb-c1 {
  width: 54px;
  height: 20px;
  top: 22px;
  left: 22px;
  box-shadow: 16px 5px 0 -4px rgba(255, 255, 255, 0.6);
}
.lb-c2 {
  width: 38px;
  height: 14px;
  top: 56px;
  right: 26px;
}
.lb-star {
  position: absolute;
  color: #fff;
  opacity: 0;
  transition: opacity 0.6s;
}
.lb-sky.is-night .lb-star {
  opacity: 0.9;
}
.lb-s1 {
  top: 20px;
  left: 30px;
}
.lb-s2 {
  top: 46px;
  right: 36px;
}
.lb-s3 {
  top: 82px;
  left: 54px;
}
.lb-s4 {
  top: 26px;
  right: 72px;
}

.lb-orb-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}
.lb-orb {
  position: relative;
  width: 178px;
  height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3px;
}
.lb-sun {
  position: absolute;
  inset: 26px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 42%, #fff1d6 0%, #ffc15e 46%, #ff9a3d 78%);
  box-shadow: 0 0 32px 6px rgba(255, 168, 80, 0.55);
  animation: lb-breathe 5.5s ease-in-out infinite;
  transition: background 0.7s ease, box-shadow 0.7s ease;
}
.lb-sky.is-night .lb-sun {
  background: radial-gradient(circle at 38% 38%, #eef0ff 0%, #c9ceff 55%, #a6abf2 100%);
  box-shadow: 0 0 30px 4px rgba(150, 150, 240, 0.5);
  clip-path: path('M89 14a74 74 0 1 0 68 102 58 58 0 0 1-68-102Z');
}
.lb-sky.is-dusk .lb-sun {
  background: radial-gradient(circle at 44% 42%, #ffffff 0%, #e7e9fc 50%, #cfd4f2 100%);
  box-shadow: 0 0 28px 4px rgba(140, 150, 220, 0.4);
}
@keyframes lb-breathe {
  0%,
  100% {
    transform: scale(0.97);
  }
  50% {
    transform: scale(1.03);
  }
}

.lb-ring {
  position: absolute;
  inset: 0;
  transform: rotate(-90deg);
}
.lb-ring .lb-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.55);
  stroke-width: 10;
}
.lb-ring .lb-prog {
  fill: none;
  stroke: #fff;
  stroke-width: 10;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.7s ease;
  filter: drop-shadow(0 2px 5px rgba(255, 255, 255, 0.6));
}

.lb-orb-core {
  position: relative;
  z-index: 3;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 26px -12px rgba(60, 40, 30, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 2px;
}
.lb-orb-state {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--lb-accent);
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.4s ease;
}
.lb-orb-time {
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
  font-size: 38px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--lb-ink);
}
.lb-orb-check {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--lb-diaper-tint);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1px;
}
.lb-orb-small {
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: var(--lb-ink);
}
/* partner: two avatars in the core */
.lb-orb-pair {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
}
.lb-orb-pair span {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 3px solid #fff;
  margin-left: -10px;
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Nunito';
}
.lb-orb-pair span:first-child {
  margin-left: 0;
}

.lb-action {
  margin-top: 9px;
  border: none;
  cursor: pointer;
  font-family: 'Nunito';
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  background: var(--lb-accent);
  padding: 13px 28px;
  border-radius: 999px;
  box-shadow: 0 12px 24px -10px var(--lb-accent);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.12s ease, background 0.4s ease, box-shadow 0.4s ease;
  z-index: 2;
  position: relative;
}
.lb-action:active {
  transform: scale(0.96);
}

/* moment line (mainTitle + mainText) */
.lb-moment {
  padding: 0 4px;
}
.lb-moment .lb-m-title {
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
  font-size: 17px;
  line-height: 1.15;
}
.lb-moment .lb-m-text {
  font-size: 12.5px;
  color: var(--lb-ink-soft);
  font-weight: 600;
  margin-top: 2px;
  line-height: 1.35;
}

/* partner sync card (replaces moment line in partner state) */
.lb-sync {
  display: none;
  align-items: center;
  gap: 12px;
  border-radius: var(--lb-r-md);
  padding: 7px 14px;
  background: linear-gradient(120deg, var(--lb-feed-tint), var(--lb-diaper-tint));
  box-shadow: var(--lb-shadow-card);
}
.lb-phone[data-state='partner'] .lb-sync {
  display: flex;
}
.lb-phone[data-state='partner'] .lb-moment {
  display: none;
}
.lb-sync .lb-sync-av {
  display: flex;
}
.lb-sync .lb-sync-av span {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2.5px solid #fff;
  margin-left: -9px;
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lb-sync .lb-sync-av span:first-child {
  margin-left: 0;
}
.lb-sync .lb-sync-tx {
  font-size: 12.5px;
  font-weight: 800;
  line-height: 1.3;
  color: var(--lb-ink);
}
.lb-sync .lb-sync-tx small {
  display: block;
  font-weight: 700;
  font-size: 11px;
  color: var(--lb-ink-soft);
  margin-top: 1px;
}

/* quick log — single compact row of 4, active highlighted */
.lb-quick {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 9px;
}
.lb-q {
  border: none;
  cursor: pointer;
  font-family: 'Nunito';
  background: var(--lb-surface);
  border-radius: var(--lb-r-sm);
  padding: 11px 6px 9px;
  box-shadow: var(--lb-shadow-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: transform 0.12s ease, box-shadow 0.3s ease;
  position: relative;
}
.lb-q:active {
  transform: scale(0.96);
}
.lb-q .lb-qi {
  width: 38px;
  height: 38px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}
.lb-q .lb-ql {
  font-size: 11px;
  font-weight: 800;
  color: var(--lb-ink-soft);
}
.lb-q.feed .lb-qi {
  background: linear-gradient(145deg, #ffe0cc, #ffd0b6);
}
.lb-q.sleep .lb-qi {
  background: linear-gradient(145deg, #e5e8fb, #d6dbf7);
}
.lb-q.diaper .lb-qi {
  background: linear-gradient(145deg, #daf4ee, #c9efe6);
}
.lb-q.pump .lb-qi {
  background: linear-gradient(145deg, #fff0d2, #fce6b6);
}
/* active state */
.lb-q.is-active {
  box-shadow: 0 0 0 2px var(--lb-accent), var(--lb-shadow-card);
}
.lb-q.is-active .lb-ql {
  color: var(--lb-accent);
}
.lb-q.is-active .lb-qi {
  transform: scale(1.05);
}

/* tonight timeline */
.lb-tl-card {
  background: var(--lb-surface);
  border-radius: var(--lb-r-md);
  padding: 15px 16px 7px;
  box-shadow: var(--lb-shadow-card);
}
.lb-tl-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.lb-tl-head h3 {
  font-family: 'Fredoka', sans-serif;
  font-size: 14.5px;
  font-weight: 500;
}
.lb-tl-head .lb-link {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--lb-accent);
  transition: color 0.4s ease;
}
.lb-tl-item {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  position: relative;
}
.lb-tl-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 13px;
  top: 32px;
  bottom: -8px;
  width: 2px;
  background: var(--lb-line);
}
.lb-tl-time {
  font-size: 11.5px;
  color: var(--lb-ink-faint);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  padding-top: 6px;
  width: 34px;
  flex-shrink: 0;
}
.lb-tl-dot {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.lb-tl-body {
  flex: 1;
  padding-top: 1px;
}
.lb-tl-body .lb-t1 {
  font-weight: 800;
  font-size: 13px;
}
.lb-tl-body .lb-t2 {
  font-size: 11.5px;
  color: var(--lb-ink-soft);
  font-weight: 600;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.lb-who {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  font-size: 8.5px;
  font-weight: 800;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@media (prefers-reduced-motion: reduce) {
  .lb-phone :deep(*) {
    animation: none !important;
  }
  .lb-dyn,
  .lb-sky,
  .lb-sun,
  .lb-action,
  .lb-prog,
  .lb-orb-state,
  .lb-link,
  .lb-qi {
    transition: none !important;
  }
}
</style>
