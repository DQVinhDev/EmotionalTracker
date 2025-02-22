<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Main Content -->
    <main class="pt-16">
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "~/components/NavBar.vue";

export default defineComponent({
  components: {
    NavBar,
  },
});
</script>

<style scoped>
/* Optional: Scoped styles for the root layout */
.pt-16 {
  padding-top: 4rem; /* Matches Tailwind's pt-16 to offset fixed navbar */
}
</style>
