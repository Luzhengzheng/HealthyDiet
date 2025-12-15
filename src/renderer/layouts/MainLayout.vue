<template>
    <div class="main-layout">
        <!-- 侧边栏 -->
        <Sidebar :currentKey="currentPage" @select="handleSidebarSelect" />

        <!-- 主内容区 -->
        <div class="main-content">
            <Transition name="fade" mode="out-in">
                <component :is="currentPageComponent" :key="currentPage" />
            </Transition>
        </div>

        <!-- 记录模态框 -->
        <RecordModal
            v-model:open="recordModalVisible"
            :title="recordModalTitle"
            :label="recordModalLabel"
            :units="recordModalUnits"
            @confirm="handleRecordConfirm"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw, defineAsyncComponent } from 'vue';
import { Modal } from 'ant-design-vue';
import Sidebar, { type SidebarItem } from '../components/Sidebar.vue';
import Home from '../pages/Home.vue';
import Settings from '../pages/Settings.vue';
import RecordModal, { type Unit } from '../components/RecordModal.vue';
import type { Dayjs } from 'dayjs';
import { version } from '../../../package.json';

//主页面/父页面同步加载,子页面/组件按需异步加载
const HomePage = markRaw(Home);
const SettingsPage = markRaw(Settings);
const RecipePage = markRaw(defineAsyncComponent(() => import('../components/Recipe.vue')));

// 当前选中的页面
const currentPage = ref('home');

// 页面组件映射
const pageComponents: Record<string, any> = {
    home: HomePage,
    settings: SettingsPage,
    recipe: RecipePage,
    // 可以在这里添加更多页面
    // record: markRaw(RecordPage),
    // list: markRaw(ListPage),
    // stats: markRaw(StatsPage),
};

// 记录模态框状态
const recordModalVisible = ref(false);
const recordModalTitle = ref('记录体重');
const recordModalLabel = ref('体重');
const recordModalUnits = ref<Unit[]>([
    { label: 'kg', value: 'kg' },
    { label: '斤', value: 'jin' },
    { label: '磅', value: 'lb' },
]);

// 当前页面组件
const currentPageComponent = computed(() => {
    return pageComponents[currentPage.value] || Home;
});

// 处理侧边栏选择
const handleSidebarSelect = (item: SidebarItem) => {
    if (item.type === 'page') {
        // 如果是页面节点，切换页面
        if (pageComponents[item.key]) {
            currentPage.value = item.key;
        } else {
            // 页面还未实现时的提示
            Modal.info({
                title: '功能开发中',
                content: `"${item.label}" 页面正在开发中，敬请期待！`,
                centered: true,
            });
        }
    } else if (item.type === 'action') {
        // 如果是功能按钮，执行对应操作
        if (item.action) {
            item.action();
        }

        if (item.key === 'record') {
            // 打开记录模态框 (默认显示体重记录作为示例)
            recordModalTitle.value = '记录体重';
            recordModalLabel.value = '体重';
            recordModalUnits.value = [
                { label: 'kg', value: 'kg' },
                { label: '斤', value: 'jin' },
                { label: '磅', value: 'lb' },
            ];
            recordModalVisible.value = true;
        }

        // 特殊处理某些功能按钮
        if (item.key === 'about') {
            showAboutModal();
        }
    }
};

const handleRecordConfirm = (value: number, unit: string, date: Dayjs) => {
    console.log('Record confirmed:', value, unit, date.format());
    Modal.success({
        title: '记录成功',
        content: `已记录: ${value} ${unit} 时间: ${date.format('YYYY-MM-DD HH:mm')}`,
        centered: true,
    });
};

// 显示关于弹窗
const showAboutModal = () => {
    Modal.info({
        title: '关于 HealthyDiet',
        content: `HealthyDiet v${version}\n\n一款帮助您记录和分析日常饮食的健康管理应用。\n\n🥗 健康饮食，从记录开始！`,
        centered: true,
        width: 360,
    });
};
</script>

<style scoped>
.main-layout {
    display: flex;
    min-height: 100vh;
    width: 100%;
}

.main-content {
    flex: 1;
    margin-left: 48px; /* 侧边栏宽度 */
    min-height: 100vh;
    position: relative;
}

/* 页面切换过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateX(10px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateX(-10px);
}
</style>
