<template>
  <div class="practice-container">
    <div class="practice-header">
      <button class="back-button" @click="goBack">
        {{ $t('back') }}
      </button>
      <h2>{{ currentCollection.name }}</h2>
      <div class="progress">
        <span>{{ currentIndex + 1 }} / {{ cards.length }}</span>      </div>
    </div>
    <div class="practice-content">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <div v-if="cards.length > 0" class="card-container">
        <div class="flashcard" :style="{ transform: `rotateY(${isFlipped ? 180 : 0}deg)` }" @click="toggleFlip">
          <div class="card-inner">
            <div class="card-front">
              <p class="card-label">{{ isFlipped ? $t('answer') : $t('question') }}</p>
              <p class="card-text">{{ currentCard.front }}</p>
            </div>
            <div class="card-back">
              <p class="card-label">{{ $t('answer') }}</p>
              <p class="card-text">{{ currentCard.back }}</p>
            </div>
          </div>
        </div>

        <p class="click-hint">{{ $t('clickHint') }}</p>

        <div class="card-actions">
          <button class="action-button btn-previous" @click="previousCard" :disabled="currentIndex === 0">
            {{ $t('previous') }}
          </button>

          <div class="spacer"></div>

          <button class="action-button btn-next" @click="nextCard" :disabled="currentIndex === cards.length - 1">
            {{ $t('next') }}
          </button>
        </div>

        <div v-if="currentIndex === cards.length - 1" class="completion-message">
          <p>{{ $t('completionMessage') }}</p>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>No cards in this collection yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { currentCollection, practiceMode } from '../stores'

const router = useRouter()
const currentIndex = ref(0)
const isFlipped = ref(false)
const cards = ref([])

const shuffleCards = (items) => {
  const shuffled = items.slice()
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

watch(
  currentCollection,
  (collection) => {
    if (collection && collection.cards) {
      cards.value = shuffleCards(collection.cards)
      currentIndex.value = 0
      isFlipped.value = false
    } else {
      cards.value = []
    }
  },
  { immediate: true }
)

const currentCard = computed(() => {
  return cards.value[currentIndex.value] ?? null
})

const progressPercent = computed(() => {
  if (!cards.value.length) return 0
  return ((currentIndex.value + 1) / cards.value.length) * 100
})

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

const nextCard = async () => {
  isFlipped.value = false
  await new Promise((resolve) => setTimeout(resolve, 300)) // Wait for flip animation to finish
  if (currentIndex.value < cards.value.length - 1) {
    currentIndex.value++

  }
}

const previousCard = async () => {
  isFlipped.value = false
  await new Promise((resolve) => setTimeout(resolve, 300)) // Wait for flip animation to finish
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const goBack = () => {
  practiceMode.value = null
  router.push({ name: 'ModeSelection', params: { collectionId: currentCollection.value?.id } })
  currentIndex.value = 0
  cards.value = []
  isFlipped.value = false
}
</script>

<style scoped>
.practice-container {
  animation: fadeIn 0.3s ease-in;
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

.practice-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.back-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s ease;
  font-weight: 600;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.practice-header h2 {
  color: white;
  font-size: 1.8em;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.progress {
  color: white;
  font-size: 1.1em;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
}

.practice-content {
  max-width: 600px;
  margin: 0 auto;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 40px;
}

.progress-fill {
  height: 100%;
  background: white;
  transition: width 0.3s ease;
}

.card-container {
  perspective: 1000px;
}

.flashcard {
  background: white;
  border-radius: 12px;
  height: 300px;
  cursor: pointer;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;
}

.card-front {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  z-index: 2;
}

.card-back {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  transform: rotateY(180deg);
}

.card-label {
  font-size: 0.9em;
  opacity: 0.8;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-text {
  font-size: 2em;
  font-weight: 600;
  margin: 0;
}

.click-hint {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9em;
  margin-bottom: 30px;
}

.card-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  justify-content: center;
}

.action-button {
  padding: 12px 24px;
  border: 2px solid white;
  background: transparent;
  color: white;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover:not(:disabled) {
  background: white;
  color: #667eea;
  transform: scale(1.05);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spacer {
  flex: 1;
}

.completion-message {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 1.1em;
  margin-top: 20px;
}

.empty-state {
  text-align: center;
  color: white;
  padding: 40px;
}

@media (max-width: 768px) {
  .flashcard {
    height: 250px;
  }

  .card-text {
    font-size: 1.5em;
  }

  .practice-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
