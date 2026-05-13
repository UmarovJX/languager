import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { appLanguage } from './stores'

const app = createApp(App)
app.use(router)
app.use(i18n)
i18n.global.locale.value = appLanguage.value
app.mount('#app')
