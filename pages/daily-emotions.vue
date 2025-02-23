<template>
  <NavBar />
  <div class="px-4 pt-16 min-h-screen bg-gradient-to-b from-green-50 to-white">
    <h2
      class="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2"
    >
      <span class="icon">📔</span>
      Nhật ký Cảm xúc & Hành động
    </h2>

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

      <!-- CBT: Suy nghĩ và Thách thức với Voice-to-Text -->
      <div v-if="value" class="space-y-2">
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
          :disabled="!value"
          class="bg-green-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-1"
        >
          <span class="icon">💾</span>
          Lưu
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "~/components/NavBar.vue";

export default defineComponent({
  components: { NavBar },
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
      negativeThought: "" as string,
      thoughtChallenge: "" as string,
      isRecognizing: false as boolean,
      currentField: "" as string,
      recognition: null as SpeechRecognition | null,
    };
  },
  methods: {
    saveEntry() {
      const entries = JSON.parse(localStorage.getItem("entries") || "[]");
      const entryData = {
        emotion: this.emotion,
        intensity: this.intensity,
        reason: this.reason,
        value: this.value,
        negativeThought: this.negativeThought,
        thoughtChallenge: this.thoughtChallenge,
        timestamp: new Date().toISOString(),
      };
      entries.push(entryData);
      localStorage.setItem("entries", JSON.stringify(entries));
      this.resetForm();
    },
    resetForm() {
      this.emotion = "";
      this.intensity = 5;
      this.reason = "";
      this.value = "";
      this.negativeThought = "";
      this.thoughtChallenge = "";
    },
    reloadForm() {
      this.resetForm();
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
});
</script>
