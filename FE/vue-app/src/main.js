import "bootstrap/dist/css/bootstrap.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPenToSquare, faTrashAlt, faXmarkCircle } from '@fortawesome/free-regular-svg-icons';

import App from "./App.vue";
import router from "./router";
import Notifications from "@kyvg/vue3-notification";

library.add(faPenToSquare, faTrashAlt, faXmarkCircle);
const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(Notifications);
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount("#app");

import "bootstrap/dist/js/bootstrap.js";
