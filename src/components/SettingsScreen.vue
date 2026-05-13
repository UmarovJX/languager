<template>
  <div class="settings-screen">
    <div class="settings-header">
      <button class="close-button" @click="$emit('close')">{{ $t('back') }}</button>
      <h2>{{ $t('settingsTitle') }}</h2>
    </div>

    <div class="settings-content">
      <label for="language-select" class="field-label">{{ $t('appLanguage') }}</label>
      <select id="language-select" v-model="selectedLanguage" class="language-select">
        <option v-for="option in languageOptions" :key="option.code" :value="option.code">
          {{ option.label }}
        </option>
      </select>
      <p class="note">{{ $t('languageHelp') }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { appLanguage } from '../stores'

const { locale, t } = useI18n()

const languageOptions = computed(() => [
  { code: 'en', label: t('languageEnglish') },
  { code: 'ru', label: t('languageRussian') },
  { code: 'uz', label: t('languageUzbek') }
])

const selectedLanguage = computed({
  get: () => appLanguage.value,
  set: (value) => {
    appLanguage.value = value
    locale.value = value
  }
})
</script>

<style scoped>
.settings-screen {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 22px;
  padding: 32px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 32px;
}

.settings-header h2 {
  margin: 0;
  font-size: 2em;
  color: #333;
}

.close-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 22px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.close-button:hover {
  transform: scale(1.03);
}

.settings-content {
  display: grid;
  gap: 16px;
}

.field-label {
  font-weight: 700;
  color: #444;
}

.language-select {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  font-size: 1em;
}

.note {
  color: #666;
  line-height: 1.6;
}
</style>
