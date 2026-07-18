<script setup>
import { computed } from 'vue'

const config = useRuntimeConfig()
const supportEmail = computed(
  () => config.public.supportEmail || '240103091@sdu.edu.kz',
)

useHead({
  title: 'Terms of Service - Lullaby',
  meta: [
    {
      name: 'description',
      content:
        'Plain-language terms for Lullaby, a baby-care tracking and support tool.',
    },
  ],
})

const sections = computed(() => [
  {
    heading: 'Use Of Lullaby',
    paragraphs: [
      'Lullaby is provided as a baby-care tracking and support tool. It helps users record baby-care moments and see supportive information.',
    ],
  },
  {
    heading: 'Not Medical Advice',
    paragraphs: [
      'Lullaby is not medical advice. It does not diagnose, treat, prevent, or cure any condition.',
      'There is no guarantee of medical accuracy. For health concerns, contact a pediatrician. For urgent or serious concerns, contact emergency services right away.',
    ],
  },
  {
    heading: 'Subscriptions And Pro',
    paragraphs: [
      'Lullaby offers an optional paid subscription, "Lullaby Pro." Pro unlocks additional features, including a shareable weekly summary and 30-day rhythm insights with computed trends. Lullaby\'s optional AI features (an AI-phrased night recap and an AI companion) also require an active Pro subscription, and, separately, your explicit in-app consent before any data is sent to the AI provider. Lullaby\'s core tracking works fully without Pro.',
      'Lullaby Pro is available as a monthly subscription (USD 4.99) or a yearly subscription (USD 29.99). Prices may vary by region and are shown in the app at the point of purchase in your local currency.',
      'Payment is charged to your Apple ID at confirmation of purchase. Subscriptions renew automatically unless auto-renew is turned off at least 24 hours before the end of the current period. Your account is charged for renewal within 24 hours before the end of the current period. You can manage or cancel your subscription anytime in your Apple ID account settings. Any unused portion of a free trial, if offered, is forfeited when you purchase a subscription.',
    ],
  },
  {
    heading: 'Support',
    paragraphs: [
      `For support, questions, or account help, contact ${supportEmail.value}.`,
    ],
  },
])
</script>

<template>
  <LegalPage
    eyebrow="Terms"
    title="Terms of Service"
    intro="Simple terms for using Lullaby as a calm baby-care tracker and support companion."
    updated="July 18, 2026"
    :sections="sections"
  />
</template>
