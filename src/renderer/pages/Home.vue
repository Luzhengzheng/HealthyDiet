<template>
    <div class="home">
        <header class="app-header glass-card">
            <div class="header-content">
                <div class="header-left">
                    <div class="date-display">
                        <CalendarOutlined class="date-icon" />
                        <span>{{ dayjs().format('YYYY 年 MM 月 DD 日') }}</span>
                    </div>
                </div>
                <div class="header-title">
                    <h1 class="gradient-text"><span class="icon-no-gradient">🥗</span>HealthyDiet</h1>
                    <p class="subtitle">健康饮食，从记录开始</p>
                </div>
            </div>
        </header>

        <main class="home-main-container">
            <!--日期选择器-->
            <section class="date-section glass-card animate-in" style="animation-delay: 0.1s">
                <div class="section-header">
                    <h3 class="section-title">
                        <ClockCircleOutlined class="section-icon" />
                        选择日期
                    </h3>
                    <a-date-picker
                        v-model:value="selectedDate"
                        value-format="YYYY-MM-DD"
                        @change="handleDateChange"
                        :allowClear="false"
                        size="large"
                        class="date-picker"
                    />
                </div>
            </section>

            <div class="home-content glass-card">
                <div class="feature-cards">
                    <div ref="calorieRingContainer" class="calorie-ring-lazy-container">
                        <Suspense v-if="shouldLoadCalorieRing">
                            <!-- TODO: 懒加载热量圆环组件-->
                        </Suspense>
                        <div v-else class="placeholder-card glass-card">
                            <div class="placeholder-content">
                                <div class="placeholder-icon">📊</div>
                                <p>加载中...</p>
                            </div>
                        </div>
                    </div>
                    <div ref="waterIntakeContainer" class="water-intake-lazy-container">
                        <Suspense v-if="shouldLoadWaterIntake">
                            <template #default>
                                <WaterIntake />
                            </template>
                            <template #fallback>
                                <div class="loading-card glass-card">
                                    <a-spin size="large" tip="加载中..." />
                                </div>
                            </template>
                        </Suspense>
                        <div v-else class="placeholder-card glass-card">
                            <div class="placeholder-content">
                                <div class="placeholder-icon">💧</div>
                                <p>加载饮水记录...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div ref="weightChartContainer" class="weight-chart-lazy-container">
                    <Suspense v-if="shouldLoadWeightChart">
                        <template #default>
                            <WeightChart />
                        </template>
                        <template #fallback>
                            <div class="loading-card glass-card">
                                <a-spin size="large" tip="加载中..." />
                            </div>
                        </template>
                    </Suspense>
                    <div v-else class="placeholder-card glass-card">
                        <div class="placeholder-content">
                            <div class="placeholder-icon">📊</div>
                            <p>滚动加载体重趋势图...</p>
                        </div>
                    </div>
                </div>

                <div class="recommendation-card glass-card">
                    <h3>健康提示</h3>
                    <p>保持规律饮食，多喝水，适度运动</p>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';

// 懒加载体重折线图组件
const WeightChart = defineAsyncComponent(() => import('../components/WeightChart.vue'));
// 懒加载饮水量柱状图组件
const WaterIntake = defineAsyncComponent(() => import('../components/WaterIntake.vue'));
// TODO:懒加载热量圆环组件

dayjs.locale('zh-cn');
const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
const shouldLoadWeightChart = ref(false);
const weightChartContainer = ref<HTMLElement | null>(null);
const shouldLoadCalorieRing = ref(false);
const calorieRingContainer = ref<HTMLElement | null>(null);
const shouldLoadWaterIntake = ref(false);
const waterIntakeContainer = ref<HTMLElement | null>(null);

const handleDateChange = () => {}; // TODO: 处理日期变化

onMounted(() => {
    // 使用 Intersection Observer 实现懒加载
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target === weightChartContainer.value && !shouldLoadWeightChart.value) {
                        shouldLoadWeightChart.value = true;
                    }
                    if (entry.target === calorieRingContainer.value && !shouldLoadCalorieRing.value) {
                        shouldLoadCalorieRing.value = true;
                    }
                    if (entry.target === waterIntakeContainer.value && !shouldLoadWaterIntake.value) {
                        shouldLoadWaterIntake.value = true;
                    }
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            rootMargin: '50px', // 提前50px开始加载
        },
    );

    if (weightChartContainer.value) {
        observer.observe(weightChartContainer.value);
    }
    if (calorieRingContainer.value) {
        observer.observe(calorieRingContainer.value);
    }
    if (waterIntakeContainer.value) {
        observer.observe(waterIntakeContainer.value);
    }
});
</script>

<style scoped>
.app-header {
    width: 100%;
    margin: 20px 0 32px;
    padding: 20px 32px;
    animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.header-title h1 {
    font-size: 42px;
    margin: 0;
    letter-spacing: -1px;
}

.header-title .subtitle {
    font-size: 16px;
    color: #888;
    margin: 0;
}

.date-display {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    color: #667eea;
}

.date-picker {
    min-width: 200px;
}

.date-section,
.form-section,
.list-section {
    width: 100%;
}
.header-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
}

.home {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
    padding: 40px;
}

.home-content {
    width: 100%;
    max-width: 1400px;
    margin: 10px auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    text-align: center;
}

.home-main-container {
    flex: 1;
    width: 100%;
    padding: 0 20px 20px;
}

h1 {
    font-size: 56px;
    margin-bottom: 12px;
    letter-spacing: -1px;
}

.subtitle {
    font-size: 20px;
    color: #888;
    margin-bottom: 48px;
}

.feature-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 48px;
}

.feature-card {
    padding: 32px 24px;
    text-align: center;
    cursor: default;
}

.feature-card:hover {
    transform: translateY(-6px);
}

.feature-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.feature-card h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 8px;
}

.feature-card p {
    font-size: 14px;
    color: #888;
    line-height: 1.6;
}

.quick-actions {
    margin-top: 16px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 16px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    color: #333;
}

.section-icon {
    font-size: 24px;
    color: #667eea;
}

.stats-section {
    width: 100%;
}

.weight-chart-lazy-container {
    width: 100%;
    margin-bottom: 24px;
    min-height: 400px;
}

.loading-card {
    width: 100%;
    padding: 60px 24px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}

.placeholder-card {
    width: 100%;
    padding: 80px 24px;
    text-align: center;
}

.placeholder-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    calorie-ring-lazy-container {
        width: 100%;
        min-height: 350px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    opacity: 0.6;
}

.placeholder-icon {
    font-size: 48px;
}

.placeholder-content p {
    font-size: 14px;
    color: #888;
    margin: 0;
}

.recommendation-card {
    width: 100%;
    padding: 32px 24px;
    text-align: center;
}

.recommendation-card h3 {
    font-size: 20px;
    color: #333;
    margin-bottom: 12px;
    margin-top: 0;
}

.recommendation-card p {
    font-size: 14px;
    color: #888;
    margin: 0;
}

/* 响应式布局 */
@media (max-width: 768px) {
    .feature-cards {
        grid-template-columns: 1fr;
    }

    h1 {
        font-size: 36px;
    }

    .home-content {
        padding: 32px 24px;
    }
}
</style>
