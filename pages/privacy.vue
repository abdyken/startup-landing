<script setup>
import { computed } from 'vue'

const config = useRuntimeConfig()
const supportEmail = computed(
  () => config.public.supportEmail || 'support@lullaby.app',
)

useHead({
  title: 'Privacy Policy - Lullaby',
  meta: [
    {
      name: 'description',
      content:
        'Plain-language privacy policy for Lullaby, a local-first baby-care tracker.',
    },
  ],
})

const sections = computed(() => [
  {
    heading: 'What Lullaby Is',
    paragraphs: [
      'Lullaby is a local-first baby-care tracker for feeds, diapers, sleep, notes, and supportive reassurance.',
      'Baby logs are stored on your device by default. If optional account, backup, sync, or sharing features are enabled, some information may be stored or processed to provide those features.',
    ],
  },
  {
    heading: 'What We Do Not Do',
    paragraphs: [
      'Lullaby does not sell personal data.',
      'Lullaby does not track users for advertising.',
    ],
  },
  {
    heading: 'Accounts And Providers',
    paragraphs: [
      'Optional account or authentication features may use third-party providers if those features are enabled. Those providers may process account information needed to sign in, keep an account secure, or support sync.',
    ],
  },
  {
    heading: 'Voice Input',
    paragraphs: [
      'Microphone or speech recognition is used only when you choose voice input. Voice input is optional, and it is used to help turn your spoken note into a log or message.',
    ],
  },
  {
    heading: 'Reassure',
    paragraphs: [
      'Reassure provides general supportive information for common baby-care questions. It is not medical advice, diagnosis, or a replacement for a pediatrician.',
    ],
  },
  {
    heading: 'Privacy And Delete Requests',
    paragraphs: [
      `You can contact support for privacy questions, data requests, or delete-account requests at ${supportEmail.value}.`,
    ],
  },
])
</script>

<template>
  <LegalPage
    eyebrow="Privacy"
    title="Privacy Policy"
    intro="A plain-language note on what Lullaby keeps local, what it does not do, and how to reach us."
    :sections="sections"
  />
</template>
