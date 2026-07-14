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
      'Subscription or Pro features are not active for the first submission unless they are explicitly enabled in the app or release notes.',
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
    :sections="sections"
  />
</template>
