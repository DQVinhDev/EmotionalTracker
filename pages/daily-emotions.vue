<template>
  <NavBar />
  <div class="p-4 pt-16 min-h-screen bg-gradient-to-b from-green-50 to-white">
    <h2 class="text-2xl font-semibold text-green-700 mb-6">
      Nhật ký Cảm xúc & Hành động
    </h2>

    <!-- Tiến trình ngày -->
    <div class="mb-6 bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
      <p class="text-sm text-gray-600">Hôm nay: {{ completedTasks }}/{{ totalTasks }} nhiệm vụ</p>
      <div class="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div :style="{ width: progressPercentage + '%' }" class="h-full bg-green-500"></div>
      </div>
    </div>

    <!-- Form chính -->
    <form @submit.prevent="saveEntry" class="space-y-4 bg-white p-4 rounded-lg shadow-sm">
      <!-- Chọn cảm xúc -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Bạn đang cảm thấy gì?</label>
        <div class="flex gap-2 mt-1 flex-wrap">
          <button
            v-for="emo in emotions"
            :key="emo.value"
            @click.prevent="emotion = emo.value"
            :class="[
              'p-2 rounded-lg text-sm',
              emotion === emo.value ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700',
            ]"
          >
            {{ emo.label }}
          </button>
        </div>
      </div>

      <!-- Cường độ cảm xúc -->
      <div v-if="emotion">
        <label class="block text-sm font-medium text-gray-700">Cảm xúc mạnh đến mức nào?</label>
        <input
          v-model.number="intensity"
          type="range"
          min="1"
          max="10"
          class="w-full mt-1 accent-green-500"
        />
        <div class="flex justify-between text-xs text-gray-500">
          <span>Nhẹ (1)</span>
          <span>{{ intensity }}</span>
          <span>Mạnh (10)</span>
        </div>
      </div>

      <!-- Lý do và Giá trị (ACT) -->
      <div v-if="emotion" class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Điều gì khiến bạn cảm thấy vậy?</label>
        <textarea
          v-model="reason"
          placeholder="Ví dụ: Tôi lo lắng vì deadline gần đến..."
          class="border p-2 w-full rounded mt-1 text-sm focus:ring-green-500 focus:border-green-500"
          rows="2"
        ></textarea>
        <label class="block text-sm font-medium text-gray-700">Việc này liên quan đến giá trị nào của bạn?</label>
        <select
          v-model="value"
          class="border p-2 w-full rounded text-sm focus:ring-green-500 focus:border-green-500"
        >
          <option value="" disabled>Chọn giá trị</option>
          <option value="trachnhiem">Trách nhiệm</option>
          <option value="phattrien">Phát triển bản thân</option>
          <option value="ketnoi">Kết nối với người khác</option>
        </select>
      </div>

      <!-- Nhiệm vụ nhỏ (SMART & Tiếp xúc Dần dần) -->
      <div v-if="value" class="bg-green-50 p-3 rounded">
        <label class="block text-sm font-medium text-gray-700">Hành động nhỏ tiếp theo là gì?</label>
        <input
          v-model="task"
          placeholder="Ví dụ: Viết 50 từ đầu tiên..."
          class="border p-2 w-full rounded mt-1 text-sm focus:ring-green-500 focus:border-green-500"
        />
        <p class="text-xs text-gray-600 mt-1 italic">Chia nhỏ để dễ bắt đầu!</p>
      </div>

      <!-- CBT: Suy nghĩ và Thách thức -->
      <div v-if="task" class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Suy nghĩ tiêu cực của bạn?</label>
        <textarea
          v-model="negativeThought"
          placeholder="Ví dụ: Tôi sẽ làm tệ..."
          class="border p-2 w-full rounded mt-1 text-sm focus:ring-green-500 focus:border-green-500"
          rows="2"
        ></textarea>
        <div v-if="negativeThought" class="bg-green-50 p-3 rounded">
          <p class="text-xs text-gray-600 italic">Suy nghĩ này có thể sai ở đâu?</p>
          <textarea
            v-model="thoughtChallenge"
            placeholder="Ví dụ: Tôi đã từng làm được trước đây..."
            class="border p-2 w-full rounded mt-1 text-sm focus:ring-green-500 focus:border-green-500"
            rows="2"
          ></textarea>
        </div>
      </div>

      <!-- Nút điều khiển -->
      <div class="flex gap-2">
        <button
          type="submit"
          :disabled="!task"
          class="bg-green-600 text-white p-2 rounded w-full text-sm hover:bg-green-700 disabled:bg-gray-400 transition"
        >
          Lưu & Thêm vào Nhiệm vụ
        </button>
        <button
          v-if="task"
          @click.prevent="startTask"
          class="bg-blue-600 text-white p-2 rounded w-full text-sm hover:bg-blue-700 transition"
        >
          Bắt đầu ngay
        </button>
        <button
          @click.prevent="reloadForm"
          class="bg-yellow-500 text-white p-2 rounded w-full text-sm hover:bg-yellow-600 transition"
        >
          Tải lại
        </button>
      </div>
    </form>

    <!-- Đồng hồ Pomodoro nếu bắt đầu -->
    <div v-if="showTimer" class="mt-4">
      <MeditationTimer :duration="15" @completed="completeTask" />
    </div>

    <!-- Modal phần thưởng -->
    <div v-if="showReward" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-4 rounded-lg shadow-lg max-w-xs text-center">
        <p class="text-sm text-gray-700 mb-3">Chúc mừng! Bạn nhận được 10 điểm 🌟</p>
        <button
          @click="closeReward"
          class="bg-green-500 text-white p-2 rounded w-full text-sm hover:bg-green-700 transition"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MeditationTimer from "~/components/MeditationTimer.vue";
import NavBar from "~/components/NavBar.vue";

export default defineComponent({
  components: { MeditationTimer, NavBar },
  data() {
    return {
      emotions: [
        { value: "vui", label: "Vui" },
        { value: "buon", label: "Buồn" },
        { value: "lolang", label: "Lo lắng" },
        { value: "tucgian", label: "Tức giận" },
        { value: "binhyen", label: "Bình yên" },
      ],
      emotion: "" as string,
      intensity: 5 as number,
      reason: "" as string,
      value: "" as string,
      task: "" as string,
      negativeThought: "" as string,
      thoughtChallenge: "" as string,
      completedTasks: 0 as number,
      totalTasks: 0 as number,
      showTimer: false as boolean,
      showReward: false as boolean,
    };
  },
  computed: {
    progressPercentage(): number {
      return this.totalTasks ? (this.completedTasks / this.totalTasks) * 100 : 0;
    },
  },
  methods: {
    saveEntry() {
      const entries = JSON.parse(localStorage.getItem("entries") || "[]");
      const entryData = {
        emotion: this.emotion,
        intensity: this.intensity,
        reason: this.reason,
        value: this.value,
        task: this.task,
        negativeThought: this.negativeThought,
        thoughtChallenge: this.thoughtChallenge,
        timestamp: new Date().toISOString(),
        completed: false,
      };
      entries.push(entryData);
      localStorage.setItem("entries", JSON.stringify(entries));
      this.totalTasks++;
      this.resetForm();
    },
    startTask() {
      this.showTimer = true;
    },
    completeTask() {
      this.showTimer = false;
      this.completedTasks++;
      this.showReward = true;
      const entries = JSON.parse(localStorage.getItem("entries") || "[]");
      const lastEntry = entries[entries.length - 1];
      lastEntry.completed = true;
      localStorage.setItem("entries", JSON.stringify(entries));
    },
    closeReward() {
      this.showReward = false;
    },
    resetForm() {
      this.emotion = "";
      this.intensity = 5;
      this.reason = "";
      this.value = "";
      this.task = "";
      this.negativeThought = "";
      this.thoughtChallenge = "";
      this.showTimer = false;
      this.showReward = false;
    },
    reloadForm() {
      this.resetForm();
    },
    loadProgress() {
      const entries = JSON.parse(localStorage.getItem("entries") || "[]");
      this.totalTasks = entries.length;
      this.completedTasks = entries.filter((e: any) => e.completed).length;
    },
  },
  mounted() {
    this.loadProgress();
  },
});
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
.transition {
  transition: all 0.2s ease-in-out;
}
</style>