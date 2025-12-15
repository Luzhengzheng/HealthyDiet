<template>
    <div class="water-intake-container glass-card">
        <div class="chart-header">
            <h3>饮水记录</h3>
            <div class="chart-actions">
                <a-button size="small" @click="addWaterRecord">添加记录</a-button>
            </div>
        </div>
        <div class="chart-wrapper">
            <canvas ref="chartCanvas" class="water-chart"></canvas>
        </div>
        <div class="chart-stats">
            <div class="stat-item">
                <span class="stat-label">今日饮水</span>
                <span class="stat-value">{{ todayWater }} ml</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">目标饮水</span>
                <span class="stat-value">{{ targetWater }} ml</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">完成度</span>
                <span class="stat-value" :class="completionClass">{{ completionRate }}</span>
            </div>
        </div>

        <!-- 添加记录模态框 -->
        <RecordModal
            v-model:open="modalOpen"
            title="添加饮水记录"
            label="饮水量"
            :units="waterUnits"
            :min="0"
            :max="5000"
            :step="10"
            :precision="0"
            @confirm="handleAddRecord"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import RecordModal, { type Unit } from './RecordModal.vue';

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const modalOpen = ref(false);

// 饮水单位配置
const waterUnits: Unit[] = [
    { label: '毫升 (ml)', value: 'ml', factor: 1 },
    { label: '茶匙', value: 'teaspoon', factor: 5 }, // 1茶匙约5ml
    { label: '杯 (250ml)', value: 'cup', factor: 250 },
];

// 模拟数据 - 最近7天的饮水量
const waterData = ref([
    { date: '12-08', amount: 2100 },
    { date: '12-09', amount: 1800 },
    { date: '12-10', amount: 2400 },
    { date: '12-11', amount: 2200 },
    { date: '12-12', amount: 1900 },
    { date: '12-13', amount: 2300 },
    { date: '12-14', amount: 2000 },
]);

const targetWater = ref(2000);

const todayWater = computed(() => {
    return waterData.value.length > 0 ? waterData.value[waterData.value.length - 1].amount : 0;
});

const completionRate = computed(() => {
    const rate = (todayWater.value / targetWater.value) * 100;
    return `${rate.toFixed(0)}%`;
});

const completionClass = computed(() => {
    const rate = (todayWater.value / targetWater.value) * 100;
    if (rate >= 100) return 'complete';
    if (rate >= 80) return 'good';
    return 'low';
});

const addWaterRecord = () => {
    modalOpen.value = true;
};

const handleAddRecord = (value: number, unit: string) => {
    // 转换为毫升
    const selectedUnit = waterUnits.find((u) => u.value === unit);
    const amountInMl = Math.round(value * (selectedUnit?.factor || 1));

    // 添加到今天的数据
    if (waterData.value.length > 0) {
        waterData.value[waterData.value.length - 1].amount += amountInMl;
    }

    // 重绘图表
    drawChart();

    message.success(`成功添加 ${amountInMl} ml 饮水记录`);
};

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
    const amounts = waterData.value.map((d) => d.amount);
    const maxAmount = Math.max(...amounts, targetWater.value);
    const yMax = Math.ceil(maxAmount / 500) * 500; // 向上取整到500的倍数

    // 绘制网格线和Y轴标签
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#888';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 5; i++) {
        const y = padding.top + ((height - padding.top - padding.bottom) * i) / 5;

        // 网格线
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        // Y轴标签
        const value = yMax - (yMax * i) / 5;
        ctx.fillText(value.toString(), padding.left - 10, y + 4);
    }

    // 绘制目标线
    const targetY = padding.top + (height - padding.top - padding.bottom) * (1 - targetWater.value / yMax);
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding.left, targetY);
    ctx.lineTo(width - padding.right, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 目标线标签
    ctx.fillStyle = '#667eea';
    ctx.textAlign = 'left';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`目标 ${targetWater.value}ml`, width - padding.right - 80, targetY - 5);

    // 绘制柱状图
    const barWidth = (width - padding.left - padding.right) / waterData.value.length;
    const barPadding = barWidth * 0.2;
    const actualBarWidth = barWidth - barPadding * 2;

    waterData.value.forEach((data, index) => {
        const x = padding.left + barWidth * index + barPadding;
        const barHeight = ((height - padding.top - padding.bottom) * data.amount) / yMax;
        const y = height - padding.bottom - barHeight;

        // 渐变色
        const gradient = ctx.createLinearGradient(x, y, x, height - padding.bottom);
        if (data.amount >= targetWater.value) {
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
        } else {
            gradient.addColorStop(0, 'rgba(102, 126, 234, 0.6)');
            gradient.addColorStop(1, 'rgba(118, 75, 162, 0.6)');
        }

        // 绘制柱子
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, actualBarWidth, barHeight);

        // 绘制柱子顶部的圆角
        ctx.beginPath();
        ctx.arc(x + actualBarWidth / 2, y, actualBarWidth / 2, Math.PI, 0);
        ctx.fill();

        // 绘制数值标签
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(data.amount.toString(), x + actualBarWidth / 2, y - 5);

        // 绘制日期标签
        ctx.fillStyle = '#888';
        ctx.font = '12px sans-serif';
        ctx.fillText(data.date, x + actualBarWidth / 2, height - padding.bottom + 20);
    });
};

onMounted(() => {
    drawChart();
    window.addEventListener('resize', drawChart);
});
</script>

<style scoped>
.water-intake-container {
    width: 100%;
    padding: 24px;
    animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.chart-header h3 {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    color: #333;
}

.chart-actions {
    display: flex;
    gap: 8px;
}

.chart-wrapper {
    width: 100%;
    height: 280px;
    margin-bottom: 20px;
}

.water-chart {
    width: 100%;
    height: 100%;
}

.chart-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.stat-label {
    font-size: 13px;
    color: #888;
    font-weight: 500;
}

.stat-value {
    font-size: 20px;
    font-weight: 700;
    color: #333;
}

.stat-value.complete {
    color: #52c41a;
}

.stat-value.good {
    color: #667eea;
}

.stat-value.low {
    color: #ff4d4f;
}

@media (max-width: 768px) {
    .chart-stats {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .chart-wrapper {
        height: 220px;
    }
}
</style>
