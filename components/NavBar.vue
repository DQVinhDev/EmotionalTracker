<template>
  <div>
    <nav class="fixed top-0 w-full bg-gray-800 p-4 z-10">
      <button @click="toggleMenu" class="text-white">☰</button>
    </nav>
    <div
      v-if="isMenuOpen"
      class="fixed top-0 left-0 w-64 h-full bg-gray-700 text-white p-4 transition-transform z-20"
    >
      <ul>
        <li @click="navigate('daily-emotions')" class="cursor-pointer py-2">
          Cảm xúc trong ngày
        </li>
        <li @click="navigate('morning-journal')" class="cursor-pointer py-2">
          Nhật ký buổi sáng
        </li>
        <li @click="navigate('evening-journal')" class="cursor-pointer py-2">
          Nhật ký buổi tối
        </li>
        <li @click="navigate('emotion-charts')" class="cursor-pointer py-2">
          Biểu đồ cảm xúc
        </li>
        <li @click="navigate('task-history')" class="cursor-pointer py-2">
          Lịch sử Nhiệm vụ
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    navigate(route: string) {
      this.$router.push(`/${route}`);
      this.isMenuOpen = false;
    },
  },
});
</script>
