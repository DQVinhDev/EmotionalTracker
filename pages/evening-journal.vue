<template>
  <div class="p-4 pt-16 min-h-screen bg-gradient-to-b from-purple-50 to-white">
    <h2 class="text-xl font-semibold text-purple-700 mb-6">Nhật ký buổi tối</h2>

    <!-- Ô biết ơn với Voice-to-Text -->
    <div class="relative mb-4">
      <label class="block text-sm font-medium text-gray-700"
        >Điều tôi biết ơn hôm nay</label
      >
      <textarea
        v-model="gratitude"
        placeholder="Ví dụ: Tôi biết ơn vì được gặp bạn bè..."
        class="border p-2 w-full rounded mt-1 text-sm focus:ring-purple-500 focus:border-purple-500 pr-10"
        rows="3"
      ></textarea>
      <button
        @click.prevent="startSpeechRecognition('gratitude')"
        :class="[
          'absolute right-2 top-10 transform -translate-y-1/2 p-1 rounded-full',
          isRecognizing && currentField === 'gratitude'
            ? 'bg-red-500'
            : 'bg-purple-500',
        ]"
        title="Nhấn để nói"
      >
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6.1 6c0 3-2.54 5.1-5.1 5.1S6.9 14 6.9 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.9z"
          />
        </svg>
      </button>
    </div>

    <!-- Ô bài học với Voice-to-Text -->
    <div class="relative mb-4">
      <label class="block text-sm font-medium text-gray-700"
        >Bài học hôm nay</label
      >
      <textarea
        v-model="lesson"
        placeholder="Ví dụ: Tôi học được cách kiên nhẫn..."
        class="border p-2 w-full rounded mt-1 text-sm focus:ring-purple-500 focus:border-purple-500 pr-10"
        rows="3"
      ></textarea>
      <button
        @click.prevent="startSpeechRecognition('lesson')"
        :class="[
          'absolute right-2 top-10 transform -translate-y-1/2 p-1 rounded-full',
          isRecognizing && currentField === 'lesson'
            ? 'bg-red-500'
            : 'bg-purple-500',
        ]"
        title="Nhấn để nói"
      >
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6.1 6c0 3-2.54 5.1-5.1 5.1S6.9 14 6.9 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.9z"
          />
        </svg>
      </button>
    </div>

    <!-- Nút lưu -->
    <button
      @click="saveJournal"
      class="bg-purple-600 text-white p-2 rounded w-full text-sm hover:bg-purple-700 transition"
    >
      Lưu
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      gratitude: "" as string,
      lesson: "" as string,
      isRecognizing: false as boolean,
      currentField: "" as string,
      recognition: null as SpeechRecognition | null,
    };
  },
  methods: {
    saveJournal() {
      const journals = JSON.parse(
        localStorage.getItem("eveningJournals") || "[]"
      );
      journals.push({
        gratitude: this.gratitude,
        lesson: this.lesson,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("eveningJournals", JSON.stringify(journals));
      this.gratitude = "";
      this.lesson = "";
    },
    startSpeechRecognition(field: string) {
      if (!("webkitSpeechRecognition" in window)) {
        alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.");
        return;
      }

      if (this.isRecognizing) {
        this.recognition?.stop();
        this.isRecognizing = false;
        return;
      }

      this.currentField = field;
      this.isRecognizing = true;

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = "vi-VN"; // Ngôn ngữ tiếng Việt
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (this.currentField === "gratitude") this.gratitude = transcript;
        if (this.currentField === "lesson") this.lesson = transcript;
        this.isRecognizing = false;
      };

      this.recognition.onerror = (event) => {
        console.error("Lỗi nhận diện giọng nói:", event.error);
        alert("Có lỗi xảy ra khi nhận diện giọng nói. Vui lòng thử lại.");
        this.isRecognizing = false;
      };

      this.recognition.onend = () => {
        this.isRecognizing = false;
      };

      this.recognition.start();
    },
  },
  beforeUnmount() {
    if (this.recognition) {
      this.recognition.stop();
    }
  },
});
</script>

<style scoped>
.transition {
  transition: all 0.2s ease-in-out;
}
</style>
