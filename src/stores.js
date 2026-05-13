import { ref, watch } from 'vue'

const collectionModules = import.meta.glob('./data/collections/*.json', { eager: true })
const loadedCollections = Object.values(collectionModules).map((mod) => mod.default)
const storedLanguage = localStorage.getItem('languagerLanguage') || 'en'

export const collections = ref(loadedCollections)
export const currentCollection = ref(null)
export const appLanguage = ref(storedLanguage)
export const practiceMode = ref(null) // 'flashcard' or 'typing' or 'multipleChoice'

watch(appLanguage, (value) => {
  localStorage.setItem('languagerLanguage', value)
})
