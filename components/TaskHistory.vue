<template>
  <div class="p-4 min-h-screen bg-gradient-to-b from-green-50 to-white">
    <h3 class="text-2xl font-semibold text-green-700 mb-6">Lịch sử Nhiệm vụ</h3>

    <!-- Thanh tìm kiếm và lọc -->
    <div class="mb-4 flex gap-2">
      <input
        v-model="searchQuery"
        placeholder="Tìm kiếm nhiệm vụ..."
        class="border p-2 rounded w-full text-sm focus:ring-green-500 focus:border-green-500"
      />
      <select
        v-model="filterStatus"
        class="border p-2 rounded text-sm focus:ring-green-500 focus:border-green-500"
      >
        <option value="all">Tất cả</option>
        <option value="completed">Đã hoàn thành</option>
        <option value="pending">Chưa hoàn thành</option>
      </select>
    </div>

    <!-- Danh sách nhiệm vụ -->
    <div v-if="filteredTasks.length > 0" class="space-y-4">
      <div
        v-for="(task, index) in filteredTasks"
        :key="index"
        class="bg-white p-4 rounded-lg shadow-sm flex justify-between items-start"
      >
        <div>
          <p class="text-sm font-medium text-gray-700">
            <span :class="task.completed ? 'line-through text-gray-500' : ''">
              {{ task.task }}
            </span>
          </p>
          <p class="text-xs text-gray-600 mt-1">
            Cảm xúc: {{ getEmotionLabel(task.emotion) }} ({{
              task.intensity
            }}/10)
          </p>
          <p class="text-xs text-gray-600">
            Lý do: {{ task.reason || "Không ghi" }}
          </p>
          <p class="text-xs text-gray-600">
            Giá trị: {{ getValueLabel(task.value) }}
          </p>
          <p class="text-xs text-gray-500 italic">
            {{ formatTimestamp(task.timestamp) }}
          </p>
        </div>
        <div class="flex gap-2">
          <button
            v-if="!task.completed"
            @click="markAsCompleted(index)"
            class="bg-green-500 text-white p-1 rounded text-xs hover:bg-green-600 transition"
          >
            Hoàn thành
          </button>
          <button
            @click="deleteTask(index)"
            class="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600 transition"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>

    <!-- Thông báo nếu không có nhiệm vụ -->
    <div v-else class="text-center text-gray-600 mt-6">
      <p>Chưa có nhiệm vụ nào được ghi lại.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      tasks: [] as any[],
      searchQuery: "" as string,
      filterStatus: "all" as string,
      emotions: [
        { value: "vui", label: "Vui" },
        { value: "buon", label: "Buồn" },
        { value: "lolang", label: "Lo lắng" },
        { value: "tucgian", label: "Tức giận" },
        { value: "binhyen", label: "Bình yên" },
      ],
      values: [
        { value: "trachnhiem", label: "Trách nhiệm" },
        { value: "phattrien", label: "Phát triển bản thân" },
        { value: "ketnoi", label: "Kết nối với người khác" },
      ],
    };
  },
  computed: {
    filteredTasks(): any[] {
      let filtered = this.tasks;

      // Lọc theo trạng thái
      if (this.filterStatus === "completed") {
        filtered = filtered.filter((task) => task.completed);
      } else if (this.filterStatus === "pending") {
        filtered = filtered.filter((task) => !task.completed);
      }

      // Tìm kiếm theo từ khóa
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (task) =>
            task.task.toLowerCase().includes(query) ||
            task.reason.toLowerCase().includes(query) ||
            task.emotion.toLowerCase().includes(query)
        );
      }

      return filtered;
    },
  },
  methods: {
    loadTasks() {
      this.tasks = JSON.parse(localStorage.getItem("entries") || "[]");
    },
    getEmotionLabel(emotionValue: string): string {
      const emotion = this.emotions.find((e) => e.value === emotionValue);
      return emotion ? emotion.label : emotionValue;
    },
    getValueLabel(valueValue: string): string {
      const value = this.values.find((v) => v.value === valueValue);
      return value ? value.label : valueValue;
    },
    formatTimestamp(timestamp: string): string {
      const date = new Date(timestamp);
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    markAsCompleted(index: number) {
      this.tasks[index].completed = true;
      localStorage.setItem("entries", JSON.stringify(this.tasks));
      this.loadTasks(); // Cập nhật lại giao diện
    },
    deleteTask(index: number) {
      if (confirm("Bạn có chắc muốn xóa nhiệm vụ này không?")) {
        this.tasks.splice(index, 1);
        localStorage.setItem("entries", JSON.stringify(this.tasks));
        this.loadTasks(); // Cập nhật lại giao diện
      }
    },
  },
  mounted() {
    this.loadTasks();
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
.line-through {
  text-decoration: line-through;
}
</style>
