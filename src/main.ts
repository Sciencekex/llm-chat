
// Components
import { createApp } from 'vue'
import {createPinia} from "pinia";
import App from './App.vue'

// Vuetify
// import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'



const vuetify = createVuetify({
    components,
    directives,
})
const app = createApp(App)
const pinia = createPinia()

app.use(pinia).use(vuetify).mount('#app')

