import { createRouter, createWebHistory } from 'vue-router'
import CollectionList from './components/CollectionList.vue'
import PracticeModeSelector from './components/PracticeModeSelector.vue'
import PracticeScreen from './components/PracticeScreen.vue'
import TypePracticeScreen from './components/TypePracticeScreen.vue'
import MultipleChoicePracticeScreen from './components/MultipleChoicePracticeScreen.vue'
import SettingsScreen from './components/SettingsScreen.vue'
import { collections, currentCollection } from './stores'

const findCollection = (collectionId) => collections.value.find((item) => String(item.id) === String(collectionId))

const ensureCollection = (to, from, next) => {
  const collection = findCollection(to.params.collectionId)
  if (!collection) {
    return next({ name: 'Home' })
  }

  currentCollection.value = collection
  next()
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: CollectionList
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsScreen
  },
  {
    path: '/collection/:collectionId',
    name: 'ModeSelection',
    component: PracticeModeSelector,
    beforeEnter: ensureCollection
  },
  {
    path: '/collection/:collectionId/practice/flashcard',
    name: 'PracticeFlashcard',
    component: PracticeScreen,
    beforeEnter: ensureCollection
  },
  {
    path: '/collection/:collectionId/practice/typing',
    name: 'PracticeTyping',
    component: TypePracticeScreen,
    beforeEnter: ensureCollection
  },
  {
    path: '/collection/:collectionId/practice/multipleChoice',
    name: 'PracticeMultipleChoice',
    component: MultipleChoicePracticeScreen,
    beforeEnter: ensureCollection
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'Home' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
