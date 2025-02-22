<template>
  <div>
    <!-- Thanh điều hướng cố định -->
    <nav
      class="fixed top-0 w-full bg-gradient-to-r from-indigo-600 to-purple-600 p-4 shadow-lg z-10 flex justify-between items-center"
    >
      <div class="text-white text-xl font-bold tracking-wide">
        <!-- Không có tiêu đề "Bước Nhỏ" theo yêu cầu -->
      </div>
      <button
        @click="toggleMenu"
        class="text-white focus:outline-none hover:text-indigo-200 transition-colors duration-200"
      >
        <svg
          v-if="!isMenuOpen"
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          v-else
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </nav>

    <!-- Menu trượt -->
    <div
      :class="[
        'fixed top-0 left-0 w-64 h-full bg-indigo-700 text-white p-6 shadow-xl z-20 transform transition-transform duration-300 ease-in-out',
        isMenuOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="mb-8">
       
      </div>
    </div>

    <!-- Overlay khi menu mở -->
    <div
      v-if="isMenuOpen"
      @click="toggleMenu"
      class="fixed inset-0 bg-black bg-opacity-50 z-10"
    >
      <ul class="space-y-3">
        <li
          @click="navigate('daily-emotions')"
          class="cursor-pointer py-2 px-4 rounded-lg hover:bg-indigo-600 hover:text-indigo-100 transition-colors duration-200"
        >
          Cảm xúc trong ngày
        </li>
        <li
          @click="navigate('morning-journal')"
          class="cursor-pointer py-2 px-4 rounded-lg hover:bg-indigo-600 hover:text-indigo-100 transition-colors duration-200"
        >
          Nhật ký buổi sáng
        </li>
        <li
          @click="navigate('evening-journal')"
          class="cursor-pointer py-2 px-4 rounded-lg hover:bg-indigo-600 hover:text-indigo-100 transition-colors duration-200"
        >
          Nhật ký buổi tối
        </li>
        <li
          @click="navigate('emotion-charts')"
          class="cursor-pointer py-2 px-4 rounded-lg hover:bg-indigo-600 hover:text-indigo-100 transition-colors duration-200"
        >
          Biểu đồ cảm xúc
        </li>
        <li
          @click="navigate('task-history')"
          class="cursor-pointer py-2 px-4 rounded-lg hover:bg-indigo-600 hover:text-indigo-100 transition-colors duration-200"
        >
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
      this.isMenuOpen = false; // Đóng menu khi nhấp vào mục
    },
  },
});
</script>

<style scoped>
.shadow-lg {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}
.shadow-xl {
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
}
.transition-colors {
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

/* Loại bỏ dấu chấm của thẻ li */
ul {
  list-style-type: none;
  padding: 0;
}

/* Hover cho các li */
li:hover {
  transform: scale(1.02); /* Phóng to nhẹ khi hover */
  background-color: #4f46e5; /* Màu nền indigo-600 */
  color: #e0e7ff; /* Màu chữ indigo-100 */
}
</style>
