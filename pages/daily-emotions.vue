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
          Hôm nay bạn cảm thấy thế nào?
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="emo in emotions"
            :key="emo.value"
            @click.prevent="selectEmotion(emo.value)"
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
        <p v-if="emotion" class="text-xs text-green-600 mt-2">
          {{ emotionFeedback }}
        </p>
      </div>

      <!-- Cường độ cảm xúc -->
      <div v-if="emotion">
        <label
          class="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
        >
          <span class="icon">📊</span>
          Cảm xúc này mạnh đến mức nào?
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

      <!-- Lý do (ACT) -->
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
          <option value="khac">Khác (ghi chú trong suy nghĩ)</option>
        </select>
        <p v-if="value" class="text-xs text-green-600 mt-2">
          {{ valueFeedback }}
        </p>
      </div>

      <!-- CBT: Suy nghĩ và Thách thức -->
      <div v-if="value" class="space-y-2">
        <label
          class="block text-sm font-medium text-gray-700 flex items-center gap-1"
        >
          <span class="icon">☁️</span>
          Suy nghĩ nào đang xuất hiện trong đầu bạn?
        </label>
        <div class="relative">
          <textarea
            v-model="negativeThought"
            placeholder="Ví dụ: Tôi sẽ làm tệ và mọi người thất vọng..."
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
        <div
          v-if="negativeThought"
          class="bg-green-50 p-3 rounded-lg space-y-2"
        >
          <p class="text-xs text-gray-600 italic">
            {{ cbtPrompt }}
          </p>
          <div class="relative">
            <textarea
              v-model="thoughtChallenge"
              :placeholder="cbtPlaceholder"
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

      <!-- Hành động theo ACT -->
      <div v-if="thoughtChallenge" class="space-y-2">
        <label
          class="block text-sm font-medium text-gray-700 flex items-center gap-1"
        >
          <span class="icon">🚀</span>
          Bạn có thể làm gì để sống đúng với giá trị của mình?
        </label>
        <textarea
          v-model="actionPlan"
          placeholder="Ví dụ: Tôi sẽ dành 30 phút để lập kế hoạch thay vì lo lắng..."
          class="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none"
          rows="3"
        ></textarea>
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
          class="bg-yellow-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center gap-1"
        >
          <span class="icon">🔄</span>
          Tải lại
        </button>
      </div>
    </form>

    <!-- Lịch sử cảm xúc -->
    <div v-if="entries.length" class="mt-6 bg-white p-4 rounded-lg shadow">
      <h3 class="text-sm font-semibold text-green-700 mb-2">
        Xu hướng cảm xúc gần đây
      </h3>
      <ul class="space-y-2">
        <li
          v-for="(entry, index) in entries.slice(-3)"
          :key="index"
          class="text-xs text-gray-600"
        >
          <span>{{ formatDate(entry.timestamp) }}</span> -
          <span class="font-medium">{{
            emotions.find((e) => e.value === entry.emotion)?.label
          }}</span>
          ({{ entry.intensity }}/10): {{ entry.reason }}
        </li>
      </ul>
    </div>
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
      emotion: "",
      intensity: 5,
      reason: "",
      value: "",
      negativeThought: "",
      thoughtChallenge: "",
      actionPlan: "",
      isRecognizing: false,
      currentField: "",
      recognition: null as SpeechRecognition | null,
      entries: JSON.parse(localStorage.getItem("entries") || "[]"),
    };
  },
  computed: {
    emotionFeedback(): string {
      const emo = this.emotions.find((e) => e.value === this.emotion);
      return emo
        ? `Mình hiểu, bạn đang cảm thấy ${emo.label.toLowerCase()}. Cùng tìm hiểu thêm nhé!`
        : "";
    },
    valueFeedback(): string {
      const feedbacks = {
        trachnhiem:
          "Trách nhiệm là một điều quan trọng. Bạn thật sự coi trọng việc này!",
        phattrien:
          "Phát triển bản thân là một hành trình tuyệt vời. Bạn đang đi đúng hướng!",
        ketnoi: "Kết nối với người khác là điều ý nghĩa. Bạn không cô đơn đâu!",
        khac: "Giá trị của bạn thật đặc biệt. Hãy chia sẻ thêm nhé!",
      };
      return feedbacks[this.value] || "";
    },
    cbtPrompt(): string {
      if (this.negativeThought.includes("sẽ")) {
        return "Có phải bạn đang dự đoán tiêu cực về tương lai? Điều đó có chắc chắn xảy ra không?";
      } else if (
        this.negativeThought.includes("luôn luôn") ||
        this.negativeThought.includes("không bao giờ")
      ) {
        return "Có phải bạn đang nghĩ mọi thứ quá tuyệt đối? Có ngoại lệ nào không?";
      }
      return "Suy nghĩ này có thực sự phản ánh đúng hoàn cảnh không?";
    },
    cbtPlaceholder(): string {
      return "Ví dụ: Có lẽ không phải mọi thứ đều tệ như mình nghĩ...";
    },
  },
  methods: {
    selectEmotion(value: string) {
      this.emotion = value;
      this.resetLowerFields();
    },
    saveEntry() {
      const entryData = {
        emotion: this.emotion,
        intensity: this.intensity,
        reason: this.reason,
        value: this.value,
        negativeThought: this.negativeThought,
        thoughtChallenge: this.thoughtChallenge,
        actionPlan: this.actionPlan,
        timestamp: new Date().toISOString(),
      };
      this.entries.push(entryData);
      localStorage.setItem("entries", JSON.stringify(this.entries));
      this.resetForm();
      alert(
        "Mình đã lưu lại rồi! Bạn giỏi lắm vì đã dành thời gian cho cảm xúc của mình."
      );
    },
    resetForm() {
      this.emotion = "";
      this.intensity = 5;
      this.reason = "";
      this.value = "";
      this.negativeThought = "";
      this.thoughtChallenge = "";
      this.actionPlan = "";
    },
    resetLowerFields() {
      this.reason = "";
      this.value = "";
      this.negativeThought = "";
      this.thoughtChallenge = "";
      this.actionPlan = "";
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
    formatDate(isoString: string): string {
      const date = new Date(isoString);
      return date.toLocaleString("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
      });
    },
  },
});
</script>
