import { defineNuxtPlugin } from "#app";
import { createRouter, createWebHistory } from "vue-router";

export default defineNuxtPlugin((nuxtApp) => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: "/",
        name: "index",
        component: () => import("~/pages/index.vue"),
      },
      {
        path: "/daily-emotions",
        name: "daily-emotions",
        component: () => import("~/pages/daily-emotions.vue"),
      },
      {
        path: "/morning-journal",
        name: "morning-journal",
        component: () => import("~/pages/morning-journal.vue"),
      },
      {
        path: "/evening-journal",
        name: "evening-journal",
        component: () => import("~/pages/evening-journal.vue"),
      },
      {
        path: "/emotion-charts",
        name: "emotion-charts",
        component: () => import("~/pages/emotion-charts.vue"),
      },
    ],
  });

  nuxtApp.vueApp.use(router);
});
