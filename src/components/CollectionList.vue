<template>
  <div class="collections-container">
    <h2>{{ $t('selectCollection') }}</h2>

    <div class="collections-grid">
      <div
        v-for="collection in collections"
        :key="collection.id"
        class="collection-card"
        @click="selectCollection(collection)"
      >
        <div class="card-header">
          <h3>{{ collection.name }}</h3>
          <span class="language-badge">{{ collection.language }}</span>
        </div>

        <div class="card-stats">
          <span class="stat">
            <span class="stat-number">{{ collection.cards.length }}</span>
            <span class="stat-label">{{ $t('cardsLabel') }}</span>
          </span>
        </div>

        <button class="start-button">{{ $t('startPractice') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { collections, currentCollection, practiceMode } from '../stores'

const selectCollection = (collection) => {
  practiceMode.value = null
  currentCollection.value = collection
}
</script>

<style scoped>
.collections-container {
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

h2 {
  color: white;
  text-align: center;
  margin-bottom: 40px;
  font-size: 2em;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.collection-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.collection-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 1.5em;
  color: #333;
  margin: 0;
  flex: 1;
}

.language-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
  white-space: nowrap;
}

.card-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 1.8em;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 0.85em;
  color: #999;
  margin-top: 4px;
}

.start-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
}

.start-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.start-button:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .collections-grid {
    grid-template-columns: 1fr;
  }

  h2 {
    font-size: 1.5em;
  }
}
</style>
