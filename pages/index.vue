<template>
  <div>
    <NavBar />
    <NuxtPage />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "~/components/NavBar.vue";

export default defineComponent({
  components: { NavBar },
});
</script>
