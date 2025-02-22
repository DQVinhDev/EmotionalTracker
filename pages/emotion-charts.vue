<template>
  <div class="p-4 pt-16">
    <h2 class="text-xl">Biểu đồ cảm xúc</h2>
    <select v-model="timeRange" @change="updateChart" class="border p-2 w-full">
      <option value="day">Ngày</option>
      <option value="week">Tuần</option>
      <option value="month">Tháng</option>
      <option value="year">Năm</option>
    </select>
    <Bar :data="chartData" :options="chartOptions" />
    <!-- Change BarChart to Bar -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Bar } from "vue-chartjs"; // Correct import
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default defineComponent({
  components: { Bar }, // Register the Bar component
  data() {
    return {
      timeRange: "day",
      chartData: {
        labels: ["Vui", "Buồn", "Lo lắng", "Tức giận"],
        datasets: [
          { label: "Cảm xúc", data: [0, 0, 0, 0], backgroundColor: "#42A5F5" },
        ],
      },
      chartOptions: { responsive: true },
    };
  },
  mounted() {
    this.updateChart();
  },
  methods: {
    updateChart() {
      const emotions = JSON.parse(localStorage.getItem("emotions") || "[]");
      const emotionCounts = { vui: 0, buồn: 0, "lo lắng": 0, "tức giận": 0 };
      emotions.forEach((e: any) => {
        if (
          emotionCounts[e.emotion as keyof typeof emotionCounts] !== undefined
        ) {
          emotionCounts[e.emotion as keyof typeof emotionCounts]++;
        }
      });
      this.chartData.datasets[0].data = [
        emotionCounts.vui,
        emotionCounts.buồn,
        emotionCounts["lo lắng"],
        emotionCounts["tức giận"],
      ];
    },
  },
});
</script>
