<template>
  <div class="typing-practice">
    <div class="practice-header">
      <button class="back-button" @click="goBack">{{ $t('back') }}</button>
      <h2>{{ currentCollection.name }}</h2>
      <div class="progress">
        <span>{{ currentIndex + 1 }} / {{ cards.length }}</span>
      </div>
    </div>

    <div class="practice-content">
      <div v-if="!showResults" class="typing-card">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>

        <div class="word-display">
          <p class="label">{{ $t('typeTranslation') }}</p>
          <p class="word">{{ currentCard.front }}</p>
        </div>

        <div class="input-area">
          <input
            v-model="userInput"
            type="text"
            :placeholder="$t('typeTranslation')"
            @keyup.enter="submitAnswer"
            class="answer-input"
            autofocus
          />
        </div>

        <div class="action-buttons">
          <button class="btn-skip" @click="skipCard">{{ $t('skip') }}</button>
          <button class="btn-submit" @click="submitAnswer">{{ $t('submit') }}</button>
        </div>

        <div v-if="feedback" :class="['feedback', feedbackType]">
          <p class="feedback-title">{{ feedbackMessage }}</p>
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
const userInput = ref('')
const cards = ref([])
const score = ref(0)
const results = ref([])
const feedback = ref(null)
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

watch(
  currentCollection,
  (collection) => {
    if (collection && collection.cards) {
      cards.value = shuffleCards(collection.cards)
      currentIndex.value = 0
      score.value = 0
      results.value = []
      showResults.value = false
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

const scorePercentage = computed(() => {
  if (!cards.value.length) return 0
  return Math.round((score.value / cards.value.length) * 100)
})

const normalizeAnswer = (answer) => {
  return answer.trim().toLowerCase()
}

const submitAnswer = () => {
  const userAnswer = userInput.value.trim()
  const normalizedUser = normalizeAnswer(userAnswer)
  const normalizedCorrect = normalizeAnswer(currentCard.value.back)
  const isCorrect = normalizedUser === normalizedCorrect

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
    answer: userAnswer || (isCorrect ? currentCard.value.back : ''),
    correct: currentCard.value.back,
    type: isCorrect ? 'correct' : 'incorrect'
  })

  feedback.value = true

  setTimeout(() => {
    if (currentIndex.value < cards.value.length - 1) {
      currentIndex.value++
      userInput.value = ''
      feedback.value = null
      feedbackType.value = null
    } else {
      showResults.value = true
    }
  }, 1500)
}

const skipCard = () => {
  results.value.push({
    word: currentCard.value.front,
    answer: '',
    correct: currentCard.value.back,
    type: 'incorrect'
  })

  if (currentIndex.value < cards.value.length - 1) {
    currentIndex.value++
    userInput.value = ''
    feedback.value = null
  } else {
    showResults.value = true
  }
}

const restartPractice = () => {
  currentIndex.value = 0
  userInput.value = ''
  score.value = 0
  results.value = []
  feedback.value = null
  feedbackType.value = null
  showResults.value = false
  cards.value = shuffleCards(cards.value)
}

const goBack = () => {
  currentCollection.value = null
  practiceMode.value = null
  currentIndex.value = 0
  userInput.value = ''
  score.value = 0
  results.value = []
  feedback.value = null
  showResults.value = false
}
</script>

<style scoped>
.typing-practice {
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
  margin-bottom: 30px;
}

.progress-fill {
  height: 100%;
  background: white;
  transition: width 0.3s ease;
}

.typing-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.word-display {
  text-align: center;
  margin-bottom: 40px;
}

.word-display .label {
  font-size: 0.9em;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 15px;
}

.word-display .word {
  font-size: 3em;
  font-weight: 700;
  color: #667eea;
  margin: 0;
}

.input-area {
  margin-bottom: 30px;
}

.answer-input {
  width: 100%;
  padding: 16px;
  font-size: 1.2em;
  border: 2px solid #ddd;
  border-radius: 10px;
  transition: border-color 0.3s ease;
}

.answer-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.btn-skip,
.btn-submit {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-skip {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-skip:hover {
  background: rgba(102, 126, 234, 0.2);
}

.btn-submit {
  background: #667eea;
  color: white;
}

.btn-submit:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.feedback {
  padding: 16px;
  border-radius: 10px;
  margin-top: 20px;
  text-align: center;
  font-weight: 600;
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

.feedback-title {
  margin: 0 0 10px 0;
}

.correct-answer {
  font-size: 0.95em;
  margin: 0;
  font-weight: normal;
}

/* Results Screen */
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

.result-item.correct .result-icon {
  color: #4caf50;
}

.result-item.incorrect .result-icon {
  color: #f44336;
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

@media (max-width: 768px) {
  .typing-card {
    padding: 30px;
  }

  .word-display .word {
    font-size: 2em;
  }

  .results-screen {
    padding: 30px;
  }

  .score-display {
    padding: 30px;
  }

  .score-number {
    font-size: 2em;
  }
}
</style>
