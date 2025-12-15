<template>
    <div class="recipe-page">
        <!-- Header 卡片 -->
        <a-card class="header-card glass-card">
            <div class="header-content">
                <div class="header-left">
                    <h2 class="page-title">饮食计划</h2>
                </div>
                <a-button type="primary" size="large" @click="handleMyPlan"> 我的计划 </a-button>
            </div>
        </a-card>

        <!-- 餐次选择卡片 -->
        <a-card class="meal-tabs-card glass-card">
            <div class="meal-tabs">
                <div
                    v-for="meal in meals"
                    :key="meal.key"
                    :class="['meal-tab', { active: activeMeal === meal.key }]"
                    @click="selectMeal(meal.key)"
                >
                    <span class="meal-icon">{{ meal.icon }}</span>
                    <span class="meal-name">{{ meal.name }}</span>
                </div>
            </div>

            <!-- 展开的列表卡片 -->
            <transition name="slide-fade">
                <div v-if="activeMeal" class="meal-list-card">
                    <h3 class="list-title">{{ currentMeal?.name }}清单</h3>
                    <div class="todo-list">
                        <div v-for="item in currentMeal?.items" :key="item.id" class="todo-item">
                            <a-checkbox v-model:checked="item.checked" @change="handleCheckChange(item)">
                                <span class="markdown-checkbox">- [{{ item.checked ? 'x' : ' ' }}]</span>
                                <span :class="['todo-text', { completed: item.checked }]">
                                    {{ item.text }}
                                </span>
                            </a-checkbox>
                        </div>
                    </div>
                </div>
            </transition>
        </a-card>

        <!-- 快速添加按钮 -->
        <div class="quick-add-buttons">
            <div v-for="meal in meals" :key="meal.key" class="quick-add-btn glass-card" @click="openModal(meal.key)">
                <div class="btn-icon">{{ meal.icon }}</div>
                <div class="btn-text">{{ meal.name }}</div>
            </div>
        </div>

        <!-- 添加餐食模态窗口 -->
        <a-modal
            v-model:open="modalVisible"
            title="添加餐食记录"
            okText="保存"
            cancelText="取消"
            @ok="handleModalOk"
            @cancel="handleModalCancel"
            centered
            :width="550"
        >
            <div class="modal-content">
                <!-- 餐次选择 -->
                <div class="form-item">
                    <label class="form-label">餐次</label>
                    <a-radio-group
                        v-model:value="formData.mealType"
                        button-style="solid"
                        size="large"
                        class="meal-type-group"
                    >
                        <a-radio-button v-for="meal in meals" :key="meal.key" :value="meal.key">
                            {{ meal.name }}
                        </a-radio-button>
                    </a-radio-group>
                </div>

                <!-- 热量输入 -->
                <div class="form-item">
                    <label class="form-label">热量 (kcal) <span class="required">*</span></label>
                    <a-input-number
                        v-model:value="formData.calories"
                        placeholder="请输入热量"
                        :min="0"
                        :max="9999"
                        :precision="0"
                        size="large"
                        class="full-width"
                        @pressEnter="handleModalOk"
                    />
                </div>

                <!-- 宏量营养素 -->
                <div class="form-item">
                    <label class="form-label">宏量营养素(g)</label>
                    <div class="macro-inputs">
                        <a-input-number
                            v-model:value="formData.carbs"
                            placeholder="碳水 (g,选填)"
                            :min="0"
                            :max="999"
                            :precision="1"
                            size="large"
                        />
                        <a-input-number
                            v-model:value="formData.protein"
                            placeholder="蛋白质 (g,选填)"
                            :min="0"
                            :max="999"
                            :precision="1"
                            size="large"
                        />
                        <a-input-number
                            v-model:value="formData.fat"
                            placeholder="脂肪 (g,选填)"
                            :min="0"
                            :max="999"
                            :precision="1"
                            size="large"
                        />
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface TodoItem {
    id: number;
    text: string;
    checked: boolean;
}

interface Meal {
    key: MealType;
    name: string;
    icon: string;
    items: TodoItem[];
}

interface FormData {
    mealType: MealType;
    calories: number | undefined;
    carbs: number | undefined;
    protein: number | undefined;
    fat: number | undefined;
}

// 餐次数据
const meals = ref<Meal[]>([
    {
        key: 'breakfast',
        name: '早餐',
        icon: '🌅',
        items: [
            { id: 1, text: '燕麦粥 + 鸡蛋', checked: false },
            { id: 2, text: '全麦面包 + 牛奶', checked: false },
            { id: 3, text: '水果沙拉', checked: false },
        ],
    },
    {
        key: 'lunch',
        name: '午餐',
        icon: '🍱',
        items: [
            { id: 4, text: '米饭 150g', checked: false },
            { id: 5, text: '鸡胸肉 100g', checked: false },
            { id: 6, text: '炒青菜', checked: false },
            { id: 7, text: '紫菜汤', checked: false },
        ],
    },
    {
        key: 'dinner',
        name: '晚餐',
        icon: '🌙',
        items: [
            { id: 8, text: '糙米饭 100g', checked: false },
            { id: 9, text: '清蒸鱼', checked: false },
            { id: 10, text: '蔬菜沙拉', checked: false },
        ],
    },
    {
        key: 'snack',
        name: '加餐',
        icon: '🍎',
        items: [
            { id: 11, text: '坚果 30g', checked: false },
            { id: 12, text: '酸奶 150ml', checked: false },
            { id: 13, text: '苹果一个', checked: false },
        ],
    },
]);

const activeMeal = ref<MealType>('breakfast');
const modalVisible = ref(false);
const formData = ref<FormData>({
    mealType: 'breakfast',
    calories: undefined,
    carbs: undefined,
    protein: undefined,
    fat: undefined,
});

// 当前选中的餐次
const currentMeal = computed(() => meals.value.find((m) => m.key === activeMeal.value));

// 选择餐次
const selectMeal = (mealKey: MealType) => {
    activeMeal.value = mealKey;
};

// 处理复选框变化
const handleCheckChange = (item: TodoItem) => {
    console.log('Todo item checked:', item);
};

// 打开模态窗口
const openModal = (mealKey: MealType) => {
    formData.value.mealType = mealKey;
    modalVisible.value = true;
};

// 模态窗口确认
const handleModalOk = () => {
    if (!formData.value.calories) {
        message.warning('请输入热量');
        return;
    }

    // TODO: 保存数据
    console.log('Save meal data:', formData.value);
    message.success('添加成功');

    // 重置表单
    formData.value = {
        mealType: 'breakfast',
        calories: undefined,
        carbs: undefined,
        protein: undefined,
        fat: undefined,
    };
    modalVisible.value = false;
};

// 模态窗口取消
const handleModalCancel = () => {
    modalVisible.value = false;
};

// 我的计划
const handleMyPlan = () => {
    message.info('我的计划功能开发中...');
};
</script>

<style scoped>
.recipe-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

/* Header 卡片 */
.header-card {
    padding: 24px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
}

.page-title {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* 餐次选择卡片 */
.meal-tabs-card {
    padding: 24px;
}

.meal-tabs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
}

.meal-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px 20px;
    border: 2px solid #e8e8e8;
    border-radius: 12px;
    background: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
    font-weight: 500;
}

.meal-tab:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
}

.meal-tab.active {
    border-color: #667eea;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
}

.meal-icon {
    font-size: 24px;
}

.meal-name {
    font-size: 16px;
}

/* 列表卡片 */
.meal-list-card {
    padding: 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 12px;
    margin-top: 16px;
}

.list-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: #333;
}

.todo-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.todo-item {
    padding: 12px 16px;
    background: #fff;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.todo-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateX(4px);
}

.markdown-checkbox {
    font-family: 'Courier New', monospace;
    color: #999;
    margin-right: 8px;
}

.todo-text {
    font-size: 15px;
    color: #333;
    transition: all 0.2s ease;
}

.todo-text.completed {
    text-decoration: line-through;
    color: #999;
}

/* 快速添加按钮 */
.quick-add-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.quick-add-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 32px 24px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
    border: 2px solid #e8e8e8;
}

.quick-add-btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
    border-color: #667eea;
}

.btn-icon {
    font-size: 48px;
}

.btn-text {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

/* 模态窗口 */
.modal-content {
    padding: 16px 0;
}

.form-item {
    margin-bottom: 24px;
}

.form-item:last-child {
    margin-bottom: 0;
}

.form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.required {
    color: #ff4d4f;
}

.meal-type-group {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
}

.meal-type-group :deep(.ant-radio-button-wrapper) {
    text-align: center;
    border-radius: 8px;
}

.full-width {
    width: 100%;
}

.macro-inputs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
}

/* 动画 */
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
    .recipe-page {
        padding: 16px;
    }

    .meal-tabs {
        grid-template-columns: repeat(2, 1fr);
    }

    .quick-add-buttons {
        grid-template-columns: repeat(2, 1fr);
    }

    .meal-type-group {
        grid-template-columns: repeat(2, 1fr);
    }

    .macro-inputs {
        grid-template-columns: 1fr;
    }
}
</style>
