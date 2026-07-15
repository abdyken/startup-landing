<script setup>
import { computed } from 'vue'

const config = useRuntimeConfig()
const supportEmail = computed(
  () => config.public.supportEmail || '240103091@sdu.edu.kz',
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
    heading: 'Reassure and AI',
    paragraphs: [
      'Reassure provides general supportive information for common baby-care questions. It is not medical advice, diagnosis, or a replacement for a pediatrician.',
      'Reassure includes two optional features that use a third-party AI provider, Anthropic (Claude). Each is off by default and runs only after you explicitly turn it on with a separate in-app consent prompt. If you do not enable them, no data is sent to any AI provider, and Reassure works fully without them.',
      '1. AI-phrased night summary. When enabled, we send Anthropic a minimized, aggregated summary of your baby\'s logs — counts such as feeds, diaper changes, spit-ups, and longest sleep, plus a coarse age band. We do not send your baby\'s name, date of birth, your notes, or your pediatrician\'s number.',
      '2. AI companion. When enabled, the words you type or say in the Reassure free-text field are sent to Anthropic so it can write a warm, supportive reply about how you are feeling and coping. This is for emotional support only. Before anything is sent, the app checks your message on our server: messages that indicate a crisis, an infant emergency, or a medical question about your baby are never sent to the AI — they are answered locally with guidance to contact a crisis line, emergency services, or your pediatrician. We ask you not to include your baby\'s name or health details in this field.',
      'Anthropic processes this data only to generate the response and does not use data submitted through its API to train its models. Anthropic provides protections for this data that are the same as or equal to those described in this policy.',
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
    updated="July 15, 2026"
    :sections="sections"
  />
</template>
