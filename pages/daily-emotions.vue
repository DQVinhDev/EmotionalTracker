<template>
  <NavBar />
  <div class="p-4 pt-16 min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <h2 class="text-2xl font-semibold text-blue-700 mb-6">
      Cảm xúc trong ngày
    </h2>

    <!-- Form nhận diện cảm xúc -->
    <form
      @submit.prevent="saveEmotion"
      class="space-y-4 bg-white p-4 rounded-lg shadow-sm"
    >
      <!-- Chọn cảm xúc -->
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Bạn đang cảm thấy gì?</label
        >
        <select
          v-model="emotion"
          class="border p-2 w-full rounded mt-1 text-sm focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="" disabled>Chọn cảm xúc</option>
          <option value="vui">Vui</option>
          <option value="buồn">Buồn</option>
          <option value="lo lắng">Lo lắng</option>
          <option value="tức giận">Tức giận</option>
          <option value="bình yên">Bình yên</option>
        </select>
      </div>

      <!-- Cường độ cảm xúc -->
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Cường độ cảm xúc (1-10)</label
        >
        <input
          v-model.number="intensity"
          type="range"
          min="1"
          max="10"
          class="w-full mt-1 accent-blue-500"
        />
        <div class="flex justify-between text-xs text-gray-500">
          <span>1</span>
          <span>{{ intensity }}</span>
          <span>10</span>
        </div>
      </div>

      <!-- Ghi chú cảm xúc (ACT) -->
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Điều gì khiến bạn cảm thấy vậy?</label
        >
        <textarea
          v-model="note"
          placeholder="Ví dụ: Tôi lo lắng vì công việc..."
          class="border p-2 w-full rounded mt-1 text-sm focus:ring-blue-500 focus:border-blue-500"
          rows="2"
        ></textarea>
      </div>

      <!-- Nhận diện suy nghĩ tiêu cực (CBT) -->
      <div v-if="emotion">
        <label class="block text-sm font-medium text-gray-700"
          >Suy nghĩ tự động của bạn là gì?</label
        >
        <textarea
          v-model="negativeThought"
          placeholder="Ví dụ: Tôi sẽ thất bại..."
          class="border p-2 w-full rounded mt-1 text-sm focus:ring-blue-500 focus:border-blue-500"
          rows="2"
        ></textarea>
      </div>

      <!-- Đánh giá suy nghĩ (CBT) -->
      <div v-if="negativeThought" class="bg-blue-50 p-3 rounded">
        <p class="text-xs text-gray-600 italic">
          Suy nghĩ này có thật sự đúng không?
        </p>
        <textarea
          v-model="thoughtChallenge"
          placeholder="Ví dụ: Tôi đã làm tốt trước đây..."
          class="border p-2 w-full rounded mt-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          rows="2"
        ></textarea>
      </div>

      <!-- Thay thế suy nghĩ (CBT) -->
      <div v-if="thoughtChallenge">
        <label class="block text-sm font-medium text-gray-700"
          >Thay bằng suy nghĩ tích cực hơn</label
        >
        <textarea
          v-model="positiveThought"
          placeholder="Ví dụ: Tôi có thể cố gắng..."
          class="border p-2 w-full rounded mt-1 text-sm focus:ring-blue-500 focus:border-blue-500"
          rows="2"
        ></textarea>
      </div>

      <!-- Chọn hành động (ACT) -->
      <div v-if="emotion" class="space-y-2">
        <label class="block text-sm font-medium text-gray-700"
          >Bạn muốn làm gì với cảm xúc này?</label
        >
        <select
          v-model="action"
          class="border p-2 w-full rounded text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled>Chọn hành động</option>
          <option value="thien">Thiền để bình tâm</option>
          <option value="viet">Viết thêm để giải tỏa</option>
          <option value="boqua">Bỏ qua và tiếp tục</option>
        </select>
      </div>

      <!-- Nút lưu -->
      <button
        type="submit"
        :disabled="!emotion"
        class="bg-blue-600 text-white p-2 rounded w-full text-sm hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        Lưu cảm xúc
      </button>
    </form>

    <!-- Hành động: Thiền -->
    <div v-if="action === 'thien' && !saved" class="mt-4">
      <MeditationTimer :duration="10" @completed="completeAction" />
    </div>

    <!-- Hành động: Viết thêm -->
    <div
      v-if="action === 'viet' && !saved"
      class="mt-4 bg-white p-4 rounded-lg shadow-sm"
    >
      <label class="block text-sm font-medium text-gray-700"
        >Viết thêm suy nghĩ của bạn</label
      >
      <textarea
        v-model="extraNote"
        placeholder="Ghi lại cảm nhận..."
        class="border p-2 w-full rounded mt-1 text-sm focus:ring-purple-500 focus:border-purple-500"
        rows="2"
      ></textarea>
      <button
        @click="saveExtraNote"
        class="bg-purple-600 text-white p-2 mt-2 rounded w-full text-sm hover:bg-purple-700 transition"
      >
        Lưu ghi chú
      </button>
    </div>

    <!-- Modal cảnh báo tránh né -->
    <div
      v-if="showWarning"
      class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-4 rounded-lg shadow-lg max-w-xs text-center">
        <p class="text-sm text-gray-700 mb-3">
          Hãy dành chút thời gian với cảm xúc này nhé?
        </p>
        <button
          @click="ignoreWarning"
          class="bg-red-500 text-white p-2 rounded w-full text-sm hover:bg-red-600 transition"
        >
          Thoát
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
      emotion: "" as string,
      intensity: 5 as number,
      note: "" as string,
      negativeThought: "" as string,
      thoughtChallenge: "" as string,
      positiveThought: "" as string,
      action: "" as string,
      extraNote: "" as string,
      saved: false as boolean,
      showWarning: false as boolean,
    };
  },
  watch: {
    emotion(newVal) {
      if (newVal) this.action = ""; // Reset action khi thay đổi cảm xúc
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.emotion && !this.saved) {
      this.showWarning = true;
      next(false);
    } else {
      next();
    }
  },
  methods: {
    saveEmotion() {
      const emotions = JSON.parse(localStorage.getItem("emotions") || "[]");
      const emotionData = {
        emotion: this.emotion,
        intensity: this.intensity,
        note: this.note,
        negativeThought: this.negativeThought,
        thoughtChallenge: this.thoughtChallenge,
        positiveThought: this.positiveThought,
        action: this.action,
        extraNote: this.extraNote,
        timestamp: new Date().toISOString(),
      };

      if (this.action === "thien" || this.action === "viet") {
        this.saved = false;
      } else {
        emotions.push(emotionData);
        localStorage.setItem("emotions", JSON.stringify(emotions));
        this.resetForm();
      }
    },
    completeAction() {
      this.saved = true;
      this.saveEmotion();
    },
    saveExtraNote() {
      this.saved = true;
      this.saveEmotion();
    },
    resetForm() {
      this.emotion = "";
      this.intensity = 5;
      this.note = "";
      this.negativeThought = "";
      this.thoughtChallenge = "";
      this.positiveThought = "";
      this.action = "";
      this.extraNote = "";
      this.saved = true;
    },
    ignoreWarning() {
      this.showWarning = false;
      this.$router.push("/");
    },
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
