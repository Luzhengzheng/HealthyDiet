<template>
    <div class="calorie-ring-card glass-card">
        <div class="ring-header">
            <h3>今日热量</h3>
            <a-button type="link" size="small" @click="addMeal">+ 添加</a-button>
        </div>
        <div class="ring-container">
            <canvas ref="ringCanvas" class="calorie-ring"></canvas>
            <div class="ring-center-text">
                <div class="current-calories">{{ currentCalories }}</div>
                <div class="total-calories">/ {{ targetCalories }} kcal</div>
            </div>
        </div>
        <div class="calorie-stats">
            <div class="stat-item">
                <span class="stat-icon">🍚</span>
                <div class="stat-info">
                    <span class="stat-label">碳水</span>
                    <span class="stat-value">{{ carbsGrams }}g</span>
                </div>
            </div>
            <div class="stat-item">
                <span class="stat-icon">🥩</span>
                <div class="stat-info">
                    <span class="stat-label">蛋白质</span>
                    <span class="stat-value">{{ proteinGrams }}g</span>
                </div>
            </div>
            <div class="stat-item">
                <span class="stat-icon">🥑</span>
                <div class="stat-info">
                    <span class="stat-label">脂肪</span>
                    <span class="stat-value">{{ fatGrams }}g</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const ringCanvas = ref<HTMLCanvasElement | null>(null);

// 模拟数据
const currentCalories = ref(1450);
const targetCalories = ref(2000);
const carbsGrams = ref(165);
const proteinGrams = ref(78);
const fatGrams = ref(42);

const percentage = computed(() => {
    return Math.min((currentCalories.value / targetCalories.value) * 100, 100);
});

const drawRing = () => {
    if (!ringCanvas.value) return;

    const canvas = ringCanvas.value;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置 canvas 尺寸
    const dpr = window.devicePixelRatio || 1;
    const size = 200;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 70;
    const lineWidth = 20;

    // 清空画布
    ctx.clearRect(0, 0, size, size);

    // 绘制背景圆环
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 绘制进度圆环
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (Math.PI * 2 * percentage.value) / 100;

    // 创建渐变色
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(0.5, '#764ba2');
    gradient.addColorStop(1, '#f093fb');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 绘制末端圆点
    if (percentage.value > 0 && percentage.value < 100) {
        const endX = centerX + radius * Math.cos(endAngle);
        const endY = centerY + radius * Math.sin(endAngle);
        ctx.beginPath();
        ctx.arc(endX, endY, lineWidth / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#f093fb';
        ctx.shadowColor = 'rgba(240, 147, 251, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
};

const addMeal = () => {
    // TODO: 实现添加饮食记录功能
    console.log('添加饮食记录');
};

onMounted(() => {
    // 延迟绘制，添加动画效果
    setTimeout(() => {
        // 动画绘制
        let current = 0;
        const target = percentage.value;
        const duration = 1000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            current = target * progress;

            // 临时修改百分比进行绘制
            const originalPercentage = percentage.value;
            (percentage as any).value = current;
            drawRing();
            (percentage as any).value = originalPercentage;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }, 100);

    // 响应窗口大小变化
    window.addEventListener('resize', drawRing);
});
</script>

<style scoped>
.calorie-ring-card {
    padding: 24px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.ring-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.ring-header h3 {
    font-size: 18px;
    color: #333;
    margin: 0;
    font-weight: 600;
}

.ring-container {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto;
}

.calorie-ring {
    width: 200px;
    height: 200px;
}

.ring-center-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.current-calories {
    font-size: 36px;
    font-weight: 700;
    color: #667eea;
    line-height: 1;
}

.total-calories {
    font-size: 14px;
    color: #888;
}

.calorie-stats {
    display: flex;
    justify-content: space-around;
    gap: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.stat-icon {
    font-size: 24px;
}

.stat-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
}

.stat-label {
    font-size: 12px;
    color: #888;
}

.stat-value {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

@media (max-width: 768px) {
    .calorie-stats {
        flex-direction: column;
        gap: 12px;
    }

    .stat-item {
        justify-content: center;
    }
}
</style>
