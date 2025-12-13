<template>
    <div class="settings">
        <!-- 页面头部 -->
        <header class="settings-header glass-card">
            <div class="header-content">
                <div class="header-title">
                    <h1 class="gradient-text"><span class="icon-no-gradient">⚙️</span>设置</h1>
                    <p class="subtitle">自定义您的应用体验</p>
                </div>
            </div>
        </header>

        <main class="settings-main-container">
            <!-- 外观设置 -->
            <section class="settings-card glass-card animate-in" style="animation-delay: 0.1s">
                <div class="card-header">
                    <h3 class="card-title">
                        <BgColorsOutlined class="card-icon" />
                        外观设置
                    </h3>
                </div>
                <div class="card-content">
                    <div class="setting-row">
                        <div class="setting-label">主题选择</div>
                        <a-select
                            v-model:value="settings.appearance.theme"
                            class="setting-input"
                            :options="[
                                { label: '浅色', value: 'light' },
                                { label: '深色', value: 'dark' },
                                { label: '跟随系统', value: 'auto' },
                            ]"
                        />
                    </div>
                    <div class="setting-row">
                        <div class="setting-label">字体大小</div>
                        <a-select
                            v-model:value="settings.appearance.fontSize"
                            class="setting-input"
                            :options="[
                                { label: '小', value: 'small' },
                                { label: '中', value: 'medium' },
                                { label: '大', value: 'large' },
                            ]"
                        />
                    </div>
                </div>
            </section>

            <!-- 通知设置 -->
            <section class="settings-card glass-card animate-in" style="animation-delay: 0.2s">
                <div class="card-header">
                    <h3 class="card-title">
                        <BellOutlined class="card-icon" />
                        通知设置
                    </h3>
                </div>
                <div class="card-content">
                    <div class="setting-row">
                        <div class="setting-label">启用应用通知</div>
                        <a-switch v-model:checked="settings.notifications.enableNotifications" class="setting-input" />
                    </div>
                    <div class="setting-row">
                        <div class="setting-label">通知时播放声音</div>
                        <a-switch v-model:checked="settings.notifications.soundEnabled" class="setting-input" />
                    </div>
                    <div class="setting-row">
                        <div class="setting-label">每日提醒</div>
                        <div class="setting-input-group">
                            <a-switch v-model:checked="settings.notifications.dailyReminder" />
                            <a-time-picker
                                v-if="settings.notifications.dailyReminder"
                                v-model:value="reminderTime"
                                format="HH:mm"
                                class="time-picker-input"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <!-- 数据管理 -->
            <section class="settings-card glass-card animate-in" style="animation-delay: 0.3s">
                <div class="card-header">
                    <h3 class="card-title">
                        <DatabaseOutlined class="card-icon" />
                        数据管理
                    </h3>
                </div>
                <div class="card-content">
                    <!-- TODO:在这里添加一个启用自动备份的设置项UI-->

                    <div class="setting-row">
                        <div class="setting-label">备份频率</div>
                        <a-select
                            v-model:value="settings.data.backupFrequency"
                            class="setting-input"
                            :options="[
                                { label: '每天', value: 'daily' },
                                { label: '每周', value: 'weekly' },
                                { label: '每月', value: 'monthly' },
                            ]"
                        />
                    </div>
                    <div class="setting-row">
                        <div class="setting-label">导出格式</div>
                        <a-select
                            v-model:value="settings.data.exportFormat"
                            class="setting-input"
                            :options="[
                                { label: 'JSON', value: 'json' },
                                { label: 'CSV', value: 'csv' },
                                { label: 'Excel', value: 'excel' },
                            ]"
                        />
                    </div>
                </div>
            </section>

            <!-- 健康目标 -->
            <section class="settings-card glass-card animate-in" style="animation-delay: 0.4s">
                <div class="card-header">
                    <h3 class="card-title">
                        <HeartOutlined class="card-icon" />
                        健康目标
                    </h3>
                </div>
                <div class="card-content">
                    <div class="setting-row">
                        <div class="setting-label">每日热量目标 (kcal)</div>
                        <a-input-number
                            v-model:value="settings.health.dailyCalories"
                            class="setting-input"
                            :min="1"
                            :max="5000"
                            @change="validateHealthGoals"
                        />
                    </div>
                    <div class="setting-row">
                        <div class="setting-label">蛋白质目标 (g)</div>
                        <a-input-number
                            v-model:value="settings.health.proteinGoal"
                            class="setting-input"
                            :min="1"
                            :max="5000"
                            @change="validateHealthGoals"
                        />
                    </div>
                    <div class="setting-row">
                        <div class="setting-label">碳水化合物目标 (g)</div>
                        <a-input-number
                            v-model:value="settings.health.carbsGoal"
                            class="setting-input"
                            :min="1"
                            :max="5000"
                            @change="validateHealthGoals"
                        />
                    </div>
                    <div class="setting-row">
                        <div class="setting-label">脂肪目标 (g)</div>
                        <a-input-number
                            v-model:value="settings.health.fatGoal"
                            class="setting-input"
                            :min="1"
                            :max="5000"
                            @change="validateHealthGoals"
                        />
                    </div>
                </div>
            </section>

            <!-- 操作按钮 -->
            <div class="settings-actions glass-card animate-in" style="animation-delay: 0.5s">
                <a-button type="primary" size="large" @click="handleSave">
                    <SaveOutlined />
                    保存设置
                </a-button>
                <a-button size="large" @click="handleReset">
                    <ReloadOutlined />
                    重置为默认
                </a-button>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import {
    BgColorsOutlined,
    BellOutlined,
    DatabaseOutlined,
    HeartOutlined,
    SaveOutlined,
    ReloadOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

// 设置状态
const settings = ref({
    // 外观设置
    appearance: {
        theme: 'light', // light | dark | auto
        fontSize: 'medium', // small | medium | large
    },
    // 通知设置
    notifications: {
        enableNotifications: true,
        soundEnabled: true,
        dailyReminder: true,
        reminderTime: '09:00',
    },
    // 数据设置
    data: {
        autoBackup: true,
        backupFrequency: 'weekly', // daily | weekly | monthly
        exportFormat: 'json', // json | csv | excel
    },
    // 健康目标
    health: {
        dailyCalories: 1,
        proteinGoal: 1,
        carbsGoal: 1,
        fatGoal: 1,
    },
});

const reminderTime = ref<Dayjs | null>(dayjs('09:00', 'HH:mm'));

// 监听提醒时间变化
watch(reminderTime, (newVal) => {
    if (newVal) {
        settings.value.notifications.reminderTime = newVal.format('HH:mm');
    }
});

// 验证健康目标
const validateHealthGoals = () => {
    const { dailyCalories, proteinGoal, carbsGoal, fatGoal } = settings.value.health;

    if (dailyCalories <= 0 || proteinGoal < 0 || carbsGoal < 0 || fatGoal < 0) {
        message.warning('请输入有效的数值');
    }
};

// 保存设置
const handleSave = () => {
    // 这里可以添加实际的保存逻辑，比如调用 IPC 保存到数据库
    validateHealthGoals();
    message.success('设置已保存！');
    console.log('Saved settings:', settings.value);
};

// 重置为默认
const handleReset = () => {
    settings.value = {
        appearance: {
            theme: 'light',
            fontSize: 'medium',
        },
        notifications: {
            enableNotifications: true,
            soundEnabled: true,
            dailyReminder: true,
            reminderTime: '09:00',
        },
        data: {
            autoBackup: true,
            backupFrequency: 'weekly',
            exportFormat: 'json',
        },
        health: {
            dailyCalories: 1,
            proteinGoal: 1,
            carbsGoal: 1,
            fatGoal: 1,
        },
    };
    reminderTime.value = dayjs('09:00', 'HH:mm');
    message.info('已重置为默认设置');
};
</script>

<style scoped>
.settings {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
    padding: 40px;
}

.settings-header {
    width: 100%;
    margin: 20px 0 32px;
    padding: 20px 32px;
    animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
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

.settings-main-container {
    flex: 1;
    width: 100%;
    padding: 0 20px 20px;
    max-width: 1400px;
    margin: 0 auto;
}

/* 设置卡片 */
.settings-card {
    width: 100%;
    margin-bottom: 24px;
    padding: 32px 24px;
    text-align: left;
}

.card-header {
    margin-bottom: 24px;
    border-bottom: 2px solid rgba(102, 126, 234, 0.1);
    padding-bottom: 16px;
}

.card-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    color: #333;
}

.card-icon {
    font-size: 24px;
    color: #667eea;
}

.card-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* 设置行 */
.setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 0;
}

.setting-label {
    min-width: 160px;
    font-weight: 500;
    color: #374151;
    font-size: 15px;
}

.setting-input {
    min-width: 200px;
}

.setting-input-group {
    display: flex;
    align-items: center;
    gap: 12px;
}

.time-picker-input {
    min-width: 150px;
}

/* Ant Design 组件深度样式 */
:deep(.ant-select) {
    min-width: 200px;
}

:deep(.ant-select-selector) {
    border-radius: 6px !important;
    border-color: #d9d9d9 !important;
    background: rgba(255, 255, 255, 0.7) !important;
    transition: all 0.3s ease;
}

:deep(.ant-select-selector:hover) {
    border-color: #667eea !important;
}

:deep(.ant-select-focused .ant-select-selector) {
    border-color: #667eea !important;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1) !important;
}

:deep(.ant-input-number) {
    min-width: 150px;
}

:deep(.ant-input-number-input-wrap input) {
    border-radius: 6px;
    transition: all 0.3s ease;
}

:deep(.ant-input-number:hover .ant-input-number-input-wrap input) {
    border-color: #667eea !important;
}

:deep(.ant-input-number-focused .ant-input-number-input-wrap input) {
    border-color: #667eea !important;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1) !important;
}

:deep(.ant-switch) {
    min-width: 50px;
}

:deep(.ant-picker) {
    width: 100%;
    min-width: 150px;
}

:deep(.ant-picker-input) {
    border-radius: 6px !important;
    transition: all 0.3s ease;
}

:deep(.ant-picker-input:hover) {
    border-color: #667eea !important;
}

:deep(.ant-picker-focused .ant-picker-input) {
    border-color: #667eea !important;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1) !important;
}

/* 操作按钮 */
.settings-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    padding: 24px;
    margin-top: 24px;
}

:deep(.ant-btn) {
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.3s ease;
    min-width: 140px;
    font-size: 15px;
}

:deep(.ant-btn-primary) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
}

:deep(.ant-btn-primary:hover) {
    background: linear-gradient(135deg, #5568d3 0%, #6a3e91 100%);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

:deep(.ant-btn-default) {
    border: 1px solid #d9d9d9;
    color: #333;
}

:deep(.ant-btn-default:hover) {
    border-color: #667eea;
    color: #667eea;
}

/* 响应式布局 */
@media (max-width: 768px) {
    .settings {
        padding: 20px;
    }

    .header-title h1 {
        font-size: 32px;
    }

    .settings-card {
        padding: 20px 16px;
    }

    .setting-row {
        flex-direction: column;
        align-items: flex-start;
    }

    .setting-label {
        min-width: auto;
    }

    .setting-input {
        width: 100%;
        min-width: auto;
    }

    :deep(.ant-select) {
        width: 100%;
    }

    .settings-actions {
        flex-direction: column;
    }

    :deep(.ant-btn) {
        width: 100%;
    }
}

/* Glass card 效果（从 App.vue 继承） */
.glass-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
}

/* 动画 */
.animate-in {
    animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 渐变文本（从 Home.vue 继承） */
.gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.icon-no-gradient {
    -webkit-text-fill-color: unset;
    background: none;
    -webkit-background-clip: unset;
}
</style>
