<template>
  <NavBar />
  <div class="px-4 pt-16 min-h-screen bg-gradient-to-b from-green-50 to-white">
    <h2
      class="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2"
    >
      <span class="icon">📔</span>
      Nhật ký Cảm xúc & Hành động
    </h2>

    <!-- Tiến trình ngày -->
    <div class="mb-4 bg-white p-3 rounded-lg shadow flex flex-col gap-2">
      <p class="text-sm text-gray-600 flex items-center gap-1">
        <span class="icon">📅</span>
        Hôm nay: {{ completedTasks }}/{{ totalTasks }} nhiệm vụ
      </p>
      <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          :style="{ width: progressPercentage + '%' }"
          class="h-full bg-green-500 transition-all duration-300"
        ></div>
      </div>
    </div>

    <!-- Form chính -->
    <form
      @submit.prevent="saveEntry"
      class="space-y-4 bg-white p-4 rounded-lg shadow"
    >
      <!-- Chọn cảm xúc -->
      <div>
        <label
          class="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
        >
          <span class="icon">😊</span>
          Bạn đang cảm thấy gì?
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="emo in emotions"
            :key="emo.value"
            @click.prevent="emotion = emo.value"
            :class="[
              'px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1',
              emotion === emo.value
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
          >
            <span class="icon">{{ emo.icon }}</span>
            {{ emo.label }}
          </button>
        </div>
      </div>

      <!-- Cường độ cảm xúc -->
      <div v-if="emotion">
        <label
          class="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
        >
          <span class="icon">📊</span>
          Cảm xúc mạnh đến mức nào?
        </label>
        <input
          v-model.number="intensity"
          type="range"
          min="1"
          max="10"
          class="w-full h-2 accent-green-500 rounded-full"
        />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>Nhẹ (1)</span>
          <span>{{ intensity }}</span>
          <span>Mạnh (10)</span>
        </div>
      </div>

      <!-- Lý do (ACT) với Voice-to-Text -->
      <div v-if="emotion" class="space-y-2">
        <label
          class="block text-sm font-medium text-gray-700 flex items-center gap-1"
        >
          <span class="icon">🤔</span>
          Điều gì khiến bạn cảm thấy vậy?
        </label>
        <div class="relative">
          <textarea
            v-model="reason"
            placeholder="Ví dụ: Tôi lo lắng vì deadline gần đến..."
            class="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none"
            rows="3"
          ></textarea>
          <button
            @click.prevent="startSpeechRecognition('reason')"
            :class="[
              'absolute right-2 top-2 p-1 rounded-full',
              isRecognizing && currentField === 'reason'
                ? 'bg-red-500'
                : 'bg-green-500',
            ]"
            title="Nhấn để nói"
          >
            <span class="icon">🎤</span>
          </button>
        </div>
        <label
          class="block text-sm font-medium text-gray-700 flex items-center gap-1"
        >
          <span class="icon">💎</span>
          Việc này liên quan đến giá trị nào của bạn?
        </label>
        <select
          v-model="value"
          class="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
        >
          <option value="" disabled>Chọn giá trị</option>
          <option value="trachnhiem">Trách nhiệm</option>
          <option value="phattrien">Phát triển bản thân</option>
          <option value="ketnoi">Kết nối với người khác</option>
        </select>
      </div>

      <!-- Nhiệm vụ nhỏ (SMART) với Voice-to-Text -->
      <div v-if="value" class="bg-green-50 p-3 rounded-lg">
        <label
          class="block text-sm font-medium text-gray-700 flex items-center gap-1"
        >
          <span class="icon">📝</span>
          Hành động nhỏ tiếp theo là gì?
        </label>
        <div class="relative">
          <input
            v-model="task"
            placeholder="Ví dụ: Viết 50 từ đầu tiên..."
            class="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
          <button
            @click.prevent="startSpeechRecognition('task')"
            :class="[
              'absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full',
              isRecognizing && currentField === 'task'
                ? 'bg-red-500'
                : 'bg-green-500',
            ]"
            title="Nhấn để nói"
          >
            <span class="icon">🎤</span>
          </button>
        </div>
        <p class="text-xs text-gray-600 mt-1 italic">Chia nhỏ để dễ bắt đầu!</p>
      </div>

      <!-- CBT: Suy nghĩ và Thách thức với Voice-to-Text -->
      <div v-if="task" class="space-y-2">
        <label
          class="block text-sm font-medium text-gray-700 flex items-center gap-1"
        >
          <span class="icon">☁️</span>
          Suy nghĩ tiêu cực của bạn?
        </label>
        <div class="relative">
          <textarea
            v-model="negativeThought"
            placeholder="Ví dụ: Tôi sẽ làm tệ..."
            class="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none"
            rows="3"
          ></textarea>
          <button
            @click.prevent="startSpeechRecognition('negativeThought')"
            :class="[
              'absolute right-2 top-2 p-1 rounded-full',
              isRecognizing && currentField === 'negativeThought'
                ? 'bg-red-500'
                : 'bg-green-500',
            ]"
            title="Nhấn để nói"
          >
            <span class="icon">🎤</span>
          </button>
        </div>
        <div v-if="negativeThought" class="bg-green-50 p-3 rounded-lg">
          <p class="text-xs text-gray-600 italic mb-1">
            Suy nghĩ này có thể sai ở đâu?
          </p>
          <div class="relative">
            <textarea
              v-model="thoughtChallenge"
              placeholder="Ví dụ: Tôi đã từng làm được trước đây..."
              class="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none"
              rows="3"
            ></textarea>
            <button
              @click.prevent="startSpeechRecognition('thoughtChallenge')"
              :class="[
                'absolute right-2 top-2 p-1 rounded-full',
                isRecognizing && currentField === 'thoughtChallenge'
                  ? 'bg-red-500'
                  : 'bg-green-500',
              ]"
              title="Nhấn để nói"
            >
              <span class="icon">🎤</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Nút điều khiển -->
      <div class="grid grid-cols-2 gap-2">
        <button
          type="submit"
          :disabled="!task"
          class="bg-green-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-1"
        >
          <span class="icon">💾</span>
          Lưu & Thêm
        </button>
        <button
          v-if="task"
          @click.prevent="startTask"
          class="bg-blue-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
        >
          <span class="icon">⏳</span>
          Bắt đầu
        </button>
        <button
          @click.prevent="reloadForm"
          class="col-span-2 bg-yellow-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center gap-1"
        >
          <span class="icon">🔄</span>
          Tải lại
        </button>
      </div>
    </form>

    <!-- Đồng hồ Pomodoro nếu bắt đầu -->
    <div v-if="showTimer" class="mt-4">
      <MeditationTimer :duration="15" @completed="completeTask" />
    </div>

    <!-- Modal phần thưởng -->
    <div
      v-if="showReward"
      class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm text-center"
      >
        <p class="text-sm text-gray-700 mb-3">
          Chúc mừng! Bạn nhận được 10 điểm 🌟
        </p>
        <button
          @click="closeReward"
          class="bg-green-500 text-white py-2 rounded-lg w-full text-sm font-medium hover:bg-green-700 transition-colors"
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
        { value: "vui", label: "Vui", icon: "😊" },
        { value: "buon", label: "Buồn", icon: "😢" },
        { value: "lolang", label: "Lo lắng", icon: "😨" },
        { value: "tucgian", label: "Tức giận", icon: "😡" },
        { value: "binhyen", label: "Bình yên", icon: "😌" },
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
      isRecognizing: false as boolean,
      currentField: "" as string,
      recognition: null as SpeechRecognition | null,
    };
  },
  computed: {
    progressPercentage(): number {
      return this.totalTasks
        ? (this.completedTasks / this.totalTasks) * 100
        : 0;
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
      this.recognition.lang = "vi-VN";
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (this.currentField === "reason") this.reason = transcript;
        if (this.currentField === "task") this.task = transcript;
        if (this.currentField === "negativeThought")
          this.negativeThought = transcript;
        if (this.currentField === "thoughtChallenge")
          this.thoughtChallenge = transcript;
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
  mounted() {
    this.loadProgress();
  },
  beforeUnmount() {
    if (this.recognition) {
      this.recognition.stop();
    }
  },
});
</script>

<style scoped>
/* Không cần thêm scoped styles vì Tailwind đã xử lý hầu hết */
</style>
