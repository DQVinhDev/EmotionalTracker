<template>
  <div class="p-4 pt-16">
    <h2 class="text-xl">Nhật ký buổi sáng</h2>
    <TaskHistory />
    <input
      v-model="newTask"
      @keyup.enter="addTask"
      placeholder="Thêm nhiệm vụ"
      class="border p-2 w-full"
    />
    <ul>
      <li v-for="(task, index) in tasks" :key="index" class="flex items-center">
        <input type="checkbox" v-model="task.completed" />
        <span :class="{ 'line-through': task.completed }">{{ task.text }}</span>
      </li>
    </ul>
    <MeditationTimer :duration="5" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MeditationTimer from "~/components/MeditationTimer.vue";
import TaskHistory from "~/components/TaskHistory.vue";

export default defineComponent({
  components: { MeditationTimer, TaskHistory },
  data() {
    return {
      newTask: "",
      tasks: [] as { text: string; completed: boolean }[],
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
        localStorage.setItem("morningTasks", JSON.stringify(this.tasks));
      }
    },
  },
});
</script>
