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
                <h1 class="gradient-text"><span class="icon-no-gradient">🥗</span>HealthyDiet</h1>
                <p class="subtitle">健康饮食，从记录开始</p>

                <div class="feature-cards">
                    <div class="feature-card glass-card">
                        <div class="feature-icon">📝</div>
                        <h3>记录饮食</h3>
                        <p>轻松记录每日摄入的食物和营养</p>
                    </div>
                    <div class="feature-card glass-card">
                        <div class="feature-icon">📊</div>
                        <h3>数据分析</h3>
                        <p>可视化分析您的营养摄入情况</p>
                    </div>
                    <div class="feature-card glass-card">
                        <div class="feature-icon">🎯</div>
                        <h3>健康目标</h3>
                        <p>设定目标，追踪您的健康进度</p>
                    </div>
                </div>

                <div class="quick-actions">
                    <a-button type="primary" size="large"> 开始记录今日饮食 </a-button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';

dayjs.locale('zh-cn');
const selectedDate = ref(dayjs().format('YYYY-MM-DD'));

const handleDateChange = () => {}; // TODO: 处理日期变化
</script>

<style scoped>
.app-header {
    width: 100%;
    margin: 20px 0 32px;
    padding: 20px 32px;
    animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
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
    grid-template-columns: repeat(3, 1fr);
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
