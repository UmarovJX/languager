<template>
  <div class="multiple-choice-practice">
    <div class="practice-header">
      <button class="back-button" @click="goBack">{{ $t('back') }}</button>
      <h2>{{ currentCollection.name }}</h2>
      <div class="progress">
        <span>{{ currentIndex + 1 }} / {{ cards.length }}</span>
      </div>
    </div>

    <div class="practice-content">
      <div v-if="!showResults" class="choice-card">
        <div class="prompt">
          <p class="label">{{ $t('chooseTheRightAnswer') }}</p>
          <p class="word">{{ currentCard.front }}</p>
        </div>

        <div class="options-grid">
          <button
            v-for="(option, index) in options"
            :key="index"
            class="option-button"
            :class="{
              selected: selectedAnswer === option,
              correct: showFeedback && option === currentCard.back,
              incorrect: showFeedback && selectedAnswer === option && option !== currentCard.back
            }"
            @click="selectOption(option)"
            :disabled="showFeedback"
          >
            {{ option }}
          </button>
        </div>

        <div v-if="showFeedback" class="feedback" :class="feedbackType">
          <p>{{ feedbackMessage }}</p>
          <p v-if="feedbackType === 'incorrect'" class="correct-answer">
            <strong>{{ $t('correctAnswer') }}:</strong> {{ currentCard.back }}
          </p>
        </div>
      </div>

      <div v-else class="results-screen">
        <h2>{{ $t('results') }}</h2>
        <div class="score-display">
          <div class="score-number">{{ score }} / {{ cards.length }}</div>
          <div class="score-percentage">{{ scorePercentage }}%</div>
        </div>

        <div class="results-list">
          <div v-for="(result, idx) in results" :key="idx" :class="['result-item', result.type]">
            <div class="result-word">{{ result.word }}</div>
            <div class="result-feedback">
              <span v-if="result.type === 'correct'" class="result-icon">✓</span>
              <span v-else class="result-icon">✗</span>
              <span v-if="result.type === 'correct'">{{ result.answer }}</span>
              <span v-else>
                {{ $t('yourAnswer') }}: <strong>{{ result.answer || '—' }}</strong> |
                {{ $t('correctAnswer') }}: <strong>{{ result.correct }}</strong>
              </span>
            </div>
          </div>
        </div>

        <div class="final-actions">
          <button class="btn-restart" @click="restartPractice">{{ $t('restartPractice') }}</button>
          <button class="btn-back" @click="goBack">{{ $t('backToCollection') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { currentCollection, practiceMode } from '../stores'

const { t } = useI18n()
const currentIndex = ref(0)
const cards = ref([])
const options = ref([])
const selectedAnswer = ref(null)
const score = ref(0)
const results = ref([])
const feedback = ref(false)
const feedbackType = ref(null)
const feedbackMessage = ref('')
const showResults = ref(false)

const shuffleCards = (items) => {
  const shuffled = items.slice()
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const generateOptions = (card) => {
  if (!card) return []
  const otherAnswers = cards.value
    .filter((item) => item.id !== card.id)
    .map((item) => item.back)

  const selectedDistractors = shuffleCards(otherAnswers).slice(0, 3)
  const answerOptions = [card.back, ...selectedDistractors]

  return shuffleCards(answerOptions)
}

watch(
  currentCollection,
  (collection) => {
    if (collection && collection.cards) {
      cards.value = shuffleCards(collection.cards)
      currentIndex.value = 0
      score.value = 0
      results.value = []
      selectedAnswer.value = null
      feedback.value = false
      feedbackType.value = null
      feedbackMessage.value = ''
      showResults.value = false
      options.value = generateOptions(cards.value[0])
    }
  },
  { immediate: true }
)

const currentCard = computed(() => cards.value[currentIndex.value] ?? null)

watch(currentCard, (card) => {
  if (card) {
    options.value = generateOptions(card)
    selectedAnswer.value = null
    feedback.value = false
    feedbackType.value = null
    feedbackMessage.value = ''
  }
})

const progressPercent = computed(() => {
  if (!cards.value.length) return 0
  return ((currentIndex.value + 1) / cards.value.length) * 100
})

const scorePercentage = computed(() => {
  if (!cards.value.length) return 0
  return Math.round((score.value / cards.value.length) * 100)
})

const selectOption = (option) => {
  if (feedback.value) return
  selectedAnswer.value = option
  const isCorrect = option === currentCard.value.back

  if (isCorrect) {
    score.value++
    feedbackType.value = 'correct'
    feedbackMessage.value = '✓ ' + t('correct')
  } else {
    feedbackType.value = 'incorrect'
    feedbackMessage.value = '✗ ' + t('incorrect')
  }

  results.value.push({
    word: currentCard.value.front,
    answer: option,
    correct: currentCard.value.back,
    type: isCorrect ? 'correct' : 'incorrect'
  })

  feedback.value = true

  setTimeout(() => {
    if (currentIndex.value < cards.value.length - 1) {
      currentIndex.value++
    } else {
      showResults.value = true
    }
  }, 1200)
}

const restartPractice = () => {
  cards.value = shuffleCards(cards.value)
  currentIndex.value = 0
  score.value = 0
  results.value = []
  selectedAnswer.value = null
  feedback.value = false
  feedbackType.value = null
  feedbackMessage.value = ''
  showResults.value = false
}

const goBack = () => {
  currentCollection.value = null
  practiceMode.value = null
  currentIndex.value = 0
  selectedAnswer.value = null
  score.value = 0
  results.value = []
  feedback.value = false
  feedbackType.value = null
  feedbackMessage.value = ''
  showResults.value = false
}
</script>

<style scoped>
.multiple-choice-practice {
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
  max-width: 700px;
  margin: 0 auto;
}

.choice-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.prompt {
  text-align: center;
  margin-bottom: 30px;
}

.label {
  font-size: 0.9em;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 15px;
}

.word {
  font-size: 3em;
  font-weight: 700;
  color: #667eea;
  margin: 0;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.option-button {
  background: #eef1ff;
  color: #333;
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 20px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  min-height: 90px;
}

.option-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.12);
}

.option-button.selected {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.12);
}

.option-button.correct {
  background: rgba(76, 175, 80, 0.12);
  border-color: #4caf50;
}

.option-button.incorrect {
  background: rgba(244, 67, 54, 0.12);
  border-color: #f44336;
}

.option-button:disabled {
  cursor: not-allowed;
}

.feedback {
  padding: 20px;
  border-radius: 14px;
  font-weight: 600;
  text-align: center;
}

.feedback.correct {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  border: 2px solid #4caf50;
}

.feedback.incorrect {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border: 2px solid #f44336;
}

.correct-answer {
  margin-top: 12px;
  color: #555;
  font-size: 0.95em;
}

.results-screen {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.results-screen h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 30px;
}

.score-display {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 16px;
  margin-bottom: 30px;
}

.score-number {
  font-size: 3em;
  font-weight: 700;
  margin-bottom: 10px;
}

.score-percentage {
  font-size: 2em;
  opacity: 0.9;
}

.results-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 30px;
  text-align: left;
}

.result-item {
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.result-item.correct {
  background: rgba(76, 175, 80, 0.1);
  border-left: 4px solid #4caf50;
}

.result-item.incorrect {
  background: rgba(244, 67, 54, 0.1);
  border-left: 4px solid #f44336;
}

.result-word {
  font-weight: 600;
  color: #667eea;
  min-width: 120px;
}

.result-feedback {
  flex: 1;
  font-size: 0.95em;
}

.result-icon {
  font-weight: 700;
  margin-right: 8px;
}

.final-actions {
  display: flex;
  gap: 15px;
}

.btn-restart,
.btn-back {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-restart {
  background: #667eea;
  color: white;
}

.btn-restart:hover {
  background: #5568d3;
  transform: translateY(-2px);
}

.btn-back {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-back:hover {
  background: rgba(102, 126, 234, 0.2);
}
</style>
