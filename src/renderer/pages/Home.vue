<template>
    <div class="home">
        <div class="home-content glass-card">
            <h1 class="gradient-text">🥗 HealthyDiet</h1>
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
                <a-button type="primary" size="large">
                    开始记录今日饮食
                </a-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button as AButton } from 'ant-design-vue';
</script>

<style scoped>
.home {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 40px;
}

.home-content {
    max-width: 800px;
    width: 100%;
    padding: 48px;
    text-align: center;
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
