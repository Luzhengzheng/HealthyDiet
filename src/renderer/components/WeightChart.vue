<template>
    <div class="weight-chart-container glass-card">
        <div class="chart-header">
            <h3>体重趋势</h3>
            <div class="chart-actions">
                <a-button size="small" @click="addWeight">添加记录</a-button>
            </div>
        </div>
        <div class="chart-wrapper">
            <canvas ref="chartCanvas" class="weight-chart"></canvas>
        </div>
        <div class="chart-stats">
            <div class="stat-item">
                <span class="stat-label">当前体重</span>
                <span class="stat-value">{{ currentWeight }} kg</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">目标体重</span>
                <span class="stat-value">{{ targetWeight }} kg</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">变化</span>
                <span class="stat-value" :class="weightChangeClass">{{ weightChange }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const chartCanvas = ref<HTMLCanvasElement | null>(null);

// 模拟数据
const weightData = ref([
    { date: '12-08', weight: 70.5 },
    { date: '12-09', weight: 70.2 },
    { date: '12-10', weight: 69.8 },
    { date: '12-11', weight: 70.0 },
    { date: '12-12', weight: 69.5 },
    { date: '12-13', weight: 69.3 },
    { date: '12-14', weight: 69.0 },
]);

const targetWeight = ref(65);

const currentWeight = computed(() => {
    return weightData.value.length > 0 ? weightData.value[weightData.value.length - 1].weight : 0;
});

const weightChange = computed(() => {
    if (weightData.value.length < 2) return '0 kg';
    const first = weightData.value[0].weight;
    const last = currentWeight.value;
    const change = last - first;
    return change > 0 ? `+${change.toFixed(1)} kg` : `${change.toFixed(1)} kg`;
});

const weightChangeClass = computed(() => {
    if (weightData.value.length < 2) return '';
    const change = currentWeight.value - weightData.value[0].weight;
    return change > 0 ? 'increase' : 'decrease';
});

const drawChart = () => {
    if (!chartCanvas.value) return;

    const canvas = chartCanvas.value;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置 canvas 尺寸
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 计算数据范围
    const weights = weightData.value.map((d) => d.weight);
    const minWeight = Math.min(...weights, targetWeight.value) - 2;
    const maxWeight = Math.max(...weights, targetWeight.value) + 2;

    // 绘制网格线
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + ((height - padding.top - padding.bottom) * i) / 5;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        // 绘制 Y 轴标签
        const value = maxWeight - ((maxWeight - minWeight) * i) / 5;
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(value.toFixed(1), padding.left - 10, y + 4);
    }

    // 绘制目标线
    const targetY =
        padding.top +
        ((height - padding.top - padding.bottom) * (maxWeight - targetWeight.value)) / (maxWeight - minWeight);
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding.left, targetY);
    ctx.lineTo(width - padding.right, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 绘制目标标签
    ctx.fillStyle = '#ff6b6b';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`目标 ${targetWeight.value}kg`, width - padding.right - 80, targetY - 5);

    // 绘制折线
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const stepX = chartWidth / (weightData.value.length - 1);

    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.2)');
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0)');

    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    weightData.value.forEach((point, index) => {
        const x = padding.left + stepX * index;
        const y = padding.top + (chartHeight * (maxWeight - point.weight)) / (maxWeight - minWeight);
        if (index === 0) {
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.lineTo(padding.left + stepX * (weightData.value.length - 1), height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // 绘制折线
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    weightData.value.forEach((point, index) => {
        const x = padding.left + stepX * index;
        const y = padding.top + (chartHeight * (maxWeight - point.weight)) / (maxWeight - minWeight);
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // 绘制数据点
    weightData.value.forEach((point, index) => {
        const x = padding.left + stepX * index;
        const y = padding.top + (chartHeight * (maxWeight - point.weight)) / (maxWeight - minWeight);

        // 外圈
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 内圈
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#667eea';
        ctx.fill();

        // X 轴标签
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(point.date, x, height - padding.bottom + 20);
    });
};

const addWeight = () => {
    // TODO: 实现添加体重记录功能
    console.log('添加体重记录');
};

onMounted(() => {
    drawChart();

    // 响应窗口大小变化
    window.addEventListener('resize', drawChart);
});
</script>

<style scoped>
.weight-chart-container {
    width: 100%;
    padding: 24px;
    margin-bottom: 24px;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.chart-header h3 {
    font-size: 20px;
    color: #333;
    margin: 0;
}

.chart-wrapper {
    width: 100%;
    height: 300px;
    margin-bottom: 20px;
}

.weight-chart {
    width: 100%;
    height: 100%;
}

.chart-stats {
    display: flex;
    justify-content: space-around;
    gap: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.stat-label {
    font-size: 14px;
    color: #888;
}

.stat-value {
    font-size: 20px;
    font-weight: 600;
    color: #333;
}

.stat-value.increase {
    color: #ff6b6b;
}

.stat-value.decrease {
    color: #51cf66;
}

@media (max-width: 768px) {
    .chart-wrapper {
        height: 250px;
    }

    .chart-stats {
        flex-direction: column;
        gap: 12px;
    }
}
</style>
