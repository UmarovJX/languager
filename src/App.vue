<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-top">
        <div>
          <h1>🌍 Languager</h1>
          <p class="subtitle">{{ $t('subtitle') }}</p>
        </div>

        <button class="settings-button" @click="toggleSettings">
          {{ $t('settings') }}
        </button>
      </div>
    </header>

    <main class="app-main">
      <SettingsScreen v-if="showSettings" @close="toggleSettings" />
      <template v-else>
        <CollectionList v-if="!currentCollection" />
        <PracticeModeSelector v-else-if="!practiceMode" />
        <PracticeScreen v-else-if="practiceMode === 'flashcard'" />
        <TypePracticeScreen v-else-if="practiceMode === 'typing'" />
        <MultipleChoicePracticeScreen v-else-if="practiceMode === 'multipleChoice'" />
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { currentCollection, appLanguage, practiceMode } from './stores'
import CollectionList from './components/CollectionList.vue'
import PracticeScreen from './components/PracticeScreen.vue'
import TypePracticeScreen from './components/TypePracticeScreen.vue'
import MultipleChoicePracticeScreen from './components/MultipleChoicePracticeScreen.vue'
import PracticeModeSelector from './components/PracticeModeSelector.vue'
import SettingsScreen from './components/SettingsScreen.vue'

const showSettings = ref(false)
const { locale } = useI18n()

watch(appLanguage, (value) => {
  locale.value = value
}, { immediate: true })

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.app-header {
  color: white;
  margin-bottom: 40px;
  padding: 20px 0;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.app-header h1 {
  font-size: 3em;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.2em;
  opacity: 0.9;
}

.settings-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 12px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s ease;
  font-weight: 600;
}

.settings-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.02);
}

.app-main {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
