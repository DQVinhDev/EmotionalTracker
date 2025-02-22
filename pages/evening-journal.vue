<template>
  <div class="p-4 pt-16">
    <h2 class="text-xl">Nhật ký buổi tối</h2>
    <textarea v-model="gratitude" placeholder="Điều tôi biết ơn hôm nay" class="border p-2 w-full"></textarea>
    <textarea v-model="lesson" placeholder="Bài học hôm nay" class="border p-2 w-full mt-2"></textarea>
    <button @click="saveJournal" class="bg-blue-500 text-white p-2 mt-2">Lưu</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      gratitude: '',
      lesson: '',
    };
  },
  methods: {
    saveJournal() {
      const journals = JSON.parse(localStorage.getItem('eveningJournals') || '[]');
      journals.push({ gratitude: this.gratitude, lesson: this.lesson, timestamp: new Date() });
      localStorage.setItem('eveningJournals', JSON.stringify(journals));
      this.gratitude = '';
      this.lesson = '';
    },
  },
});
</script>