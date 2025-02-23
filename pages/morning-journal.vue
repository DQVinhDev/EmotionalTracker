<template>
  <NavBar />
  <div class="p-4 pt-16">
    <h2 class="text-xl">Nhật ký buổi sáng</h2>
    <TaskHistory />
    <input
      v-model="newTask"
      @keyup.enter="addTask"
      placeholder="Thêm nhiệm vụ"
      class="border p-2 w-full mb-4"
    />
    <ul class="space-y-2">
      <li
        v-for="(task, index) in tasks"
        :key="index"
        class="flex items-center gap-2"
      >
        <input type="checkbox" v-model="task.completed" @change="saveTasks" />
        <span :class="{ 'line-through': task.completed }">{{ task.text }}</span>
        <button
          @click="deleteTask(index)"
          class="text-red-500 hover:text-red-700 text-sm"
          title="Xóa nhiệm vụ"
        >
          ✕
        </button>
        <button
          @click="breakDownTask(index)"
          class="text-green-500 hover:text-green-700 text-sm"
          title="Chia nhỏ nhiệm vụ"
        >
          ↓
        </button>
      </li>
    </ul>

    <!-- Hiển thị các bước nhỏ nếu có -->
    <div v-if="subTasks.length" class="mt-4 bg-gray-50 p-3 rounded-lg">
      <h3 class="text-sm font-semibold text-gray-700">Các bước nhỏ:</h3>
      <ul class="list-disc pl-5 text-sm text-gray-600">
        <li v-for="(subTask, index) in subTasks" :key="index">
          {{ subTask }}
        </li>
      </ul>
    </div>

    <MeditationTimer :duration="5" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MeditationTimer from "~/components/MeditationTimer.vue";
import TaskHistory from "~/components/TaskHistory.vue";
import NavBar from "~/components/NavBar.vue";

export default defineComponent({
  components: { MeditationTimer, TaskHistory, NavBar },
  data() {
    return {
      newTask: "",
      tasks: [] as { text: string; completed: boolean }[],
      subTasks: [] as string[], // Lưu các bước nhỏ của task được chọn
    };
  },
  mounted() {
    const savedTasks = JSON.parse(localStorage.getItem("morningTasks") || "[]");
    this.tasks = savedTasks;
  },
  methods: {
    addTask() {
      if (this.newTask) {
        this.tasks.push({ text: this.newTask, completed: false });
        this.newTask = "";
        this.subTasks = []; // Xóa các bước nhỏ khi thêm task mới
        this.saveTasks();
      }
    },
    deleteTask(index: number) {
      this.tasks.splice(index, 1);
      this.subTasks = []; // Xóa các bước nhỏ nếu task bị xóa
      this.saveTasks();
    },
    breakDownTask(index: number) {
      const taskText = this.tasks[index].text;
      this.subTasks = this.generateSubTasks(taskText);
    },
    generateSubTasks(task: string): string[] {
      // Logic chia nhỏ task đơn giản bằng tiếng Việt
      const lowerTask = task.toLowerCase();

      if (lowerTask.includes("học") || lowerTask.includes("đọc")) {
        return [
          "Chuẩn bị tài liệu cần thiết",
          "Tìm một nơi yên tĩnh",
          "Đặt mục tiêu học trong 30 phút",
          "Ghi chú những ý chính",
        ];
      } else if (
        lowerTask.includes("làm việc") ||
        lowerTask.includes("dự án")
      ) {
        return [
          "Xác định nhiệm vụ ưu tiên",
          "Lập danh sách việc cần làm",
          "Dành 25 phút tập trung làm",
          "Nghỉ 5 phút để thư giãn",
        ];
      } else if (lowerTask.includes("dọn") || lowerTask.includes("sạch")) {
        return [
          "Chọn một khu vực để bắt đầu",
          "Chuẩn bị dụng cụ dọn dẹp",
          "Dành 15 phút dọn từng phần",
          "Kiểm tra lại khi xong",
        ];
      } else {
        // Trường hợp chung
        return [
          "Chia nhiệm vụ thành 3 phần nhỏ",
          "Bắt đầu với phần dễ nhất",
          "Đặt thời gian hoàn thành cho từng phần",
        ];
      }
    },
    saveTasks() {
      localStorage.setItem("morningTasks", JSON.stringify(this.tasks));
    },
  },
});
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>
