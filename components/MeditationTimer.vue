<template>
 
  <div class="bg-green-50 p-6 rounded-lg shadow-md text-center">
    <h3
      class="text-lg font-semibold text-green-700 flex items-center justify-center mb-4"
    >
      <ClockIcon class="w-6 h-6 mr-2" />
      Thiền định {{ duration }} phút
    </h3>

    <!-- Hướng dẫn thiền -->
    <div v-if="!meditating" class="text-sm text-gray-600 mb-4">
      <p>Hãy ngồi thoải mái, nhắm mắt, và hít thở sâu.</p>
      <p>Tập trung vào hơi thở và để mọi suy nghĩ trôi qua...</p>
    </div>

    <!-- Đồng hồ và điều khiển -->
    <div v-if="meditating" class="space-y-4">
      <div class="text-3xl font-semibold text-green-600">
        {{ formatTime(timeLeft) }}
      </div>
      <div class="flex justify-center space-x-4">
        <button
          @click="pauseMeditation"
          class="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition"
        >
          <PauseIcon class="w-6 h-6" />
        </button>
        <button
          @click="stopMeditation"
          class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
        >
          <StopIcon class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Nút bắt đầu -->
    <button
      v-if="!meditating"
      @click="startMeditation"
      class="bg-green-600 text-white p-3 rounded-full flex items-center justify-center mx-auto hover:bg-green-700 transition"
    >
      <PlayIcon class="w-6 h-6 mr-2" />
      Bắt đầu thiền
    </button>

    <!-- Thông báo hoàn thành -->
    <div
      v-if="completed"
      class="mt-4 text-green-700 flex items-center justify-center"
    >
      <CheckCircleIcon class="w-6 h-6 mr-2" />
      Bạn đã hoàn thành! Hãy cảm nhận sự bình yên.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  ClockIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";

export default defineComponent({
  props: {
    duration: {
      type: Number,
      default: 10,
    },
  },
  components: { ClockIcon, PlayIcon, PauseIcon, StopIcon, CheckCircleIcon },
  data() {
    return {
      meditating: false,
      timeLeft: this.duration * 60,
      timer: null as any,
      completed: false,
      audio: new Audio(""), // Âm thanh mẫu
    };
  },
  methods: {
    startMeditation() {
      this.meditating = true;
      this.completed = false;
      this.timeLeft = this.duration * 60;
      this.audio.loop = true;
      this.audio.play();
      this.timer = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.stopMeditation();
          this.completed = true;
          this.$emit("completed");
        }
      }, 1000);
    },
    pauseMeditation() {
      if (this.meditating) {
        clearInterval(this.timer);
        this.audio.pause();
        this.meditating = false;
      } else {
        this.startMeditation(); // Nếu đang tạm dừng, tiếp tục
      }
    },
    stopMeditation() {
      clearInterval(this.timer);
      this.audio.pause();
      this.audio.currentTime = 0;
      this.meditating = false;
    },
    formatTime(seconds: number) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${
        remainingSeconds < 10 ? "0" : ""
      }${remainingSeconds}`;
    },
  },
  beforeUnmount() {
    this.stopMeditation(); // Dừng âm thanh khi component bị hủy
  },
});
</script>

<style scoped>
.transition {
  transition: all 0.2s ease-in-out;
}
</style>
