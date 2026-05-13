<template>
  <div class="mode-selector">
    <button class="close-btn" @click="goBack">{{ $t('back') }}</button>
    
    <h2>{{ $t('selectPracticeMode') }}</h2>

    <div class="mode-grid">
      <div class="mode-card" @click="selectMode('flashcard')">
        <div class="mode-icon">🎴</div>
        <h3>{{ $t('flashcardMode') }}</h3>
        <p>{{ $t('flashcardModeDesc') }}</p>
      </div>

      <div class="mode-card" @click="selectMode('typing')">
        <div class="mode-icon">⌨️</div>
        <h3>{{ $t('typingMode') }}</h3>
        <p>{{ $t('typingModeDesc') }}</p>
      </div>

      <div class="mode-card" @click="selectMode('multipleChoice')">
        <div class="mode-icon">❓</div>
        <h3>{{ $t('multipleChoiceMode') }}</h3>
        <p>{{ $t('multipleChoiceModeDesc') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { currentCollection, practiceMode } from '../stores'

const selectMode = (mode) => {
  practiceMode.value = mode
}

const goBack = () => {
  currentCollection.value = null
  practiceMode.value = null
}
</script>

<style scoped>
.mode-selector {
  animation: fadeIn 0.3s ease-in;
  position: relative;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s ease;
  font-weight: 600;
  margin-bottom: 20px;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

h2 {
  color: white;
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.2em;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.mode-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.mode-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.mode-icon {
  font-size: 4em;
  margin-bottom: 20px;
}

.mode-card h3 {
  font-size: 1.8em;
  color: #333;
  margin: 10px 0;
}

.mode-card p {
  color: #666;
  font-size: 1.1em;
  margin: 10px 0 0 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .mode-grid {
    grid-template-columns: 1fr;
  }

  h2 {
    font-size: 1.5em;
  }
}
</style>
