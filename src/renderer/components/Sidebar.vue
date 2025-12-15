<template>
    <div class="sidebar">
        <!-- 侧边栏图标区 -->
        <div class="sidebar-icons">
            <div
                v-for="item in sidebarItems"
                :key="item.key"
                class="sidebar-icon-wrapper"
                :class="{ active: currentKey === item.key }"
                @click="handleItemClick(item)"
                :title="item.label"
            >
                <component :is="item.icon" class="sidebar-icon" />
            </div>
        </div>

        <!-- 底部操作区 -->
        <div class="sidebar-bottom">
            <div
                v-for="item in bottomItems"
                :key="item.key"
                class="sidebar-icon-wrapper"
                :class="{ active: currentKey === item.key }"
                @click="handleItemClick(item)"
                :title="item.label"
            >
                <component :is="item.icon" class="sidebar-icon" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
    HomeOutlined,
    PieChartOutlined,
    FormOutlined,
    UnorderedListOutlined,
    SettingOutlined,
    InfoCircleOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons-vue';

export interface SidebarItem {
    key: string;
    label: string;
    icon: any;
    type: 'page' | 'action';
    action?: () => void;
}

const props = defineProps<{
    currentKey: string;
}>();

const emit = defineEmits<{
    (e: 'select', item: SidebarItem): void;
}>();

// TODO: 根据上下文添加一个AI助手功能项,找到正确的函数并完成添加

// 主要导航项 (页面节点)
const sidebarItems = computed<SidebarItem[]>(() => [
    {
        key: 'home',
        label: '主页',
        icon: HomeOutlined,
        type: 'page',
    },
    {
        key: 'record',
        label: '添加记录',
        icon: PlusCircleOutlined,
        type: 'action',
    },
    {
        key: 'plan',
        label: '饮食计划',
        icon: FormOutlined,
        type: 'page',
    },
    {
        key: 'recipe',
        label: '食谱',
        icon: UnorderedListOutlined,
        type: 'page',
    },
    {
        key: 'stats',
        label: '统计分析',
        icon: PieChartOutlined,
        type: 'page',
    },
]);

// 底部功能项 (可以是页面也可以是功能按钮)
const bottomItems = computed<SidebarItem[]>(() => [
    {
        key: 'settings',
        label: '设置',
        icon: SettingOutlined,
        type: 'page',
    },
    {
        key: 'about',
        label: '关于',
        icon: InfoCircleOutlined,
        type: 'action',
        action: () => {
            // 可以在这里触发一个弹窗或其他操作
            console.log('About clicked');
        },
    },
]);

const handleItemClick = (item: SidebarItem) => {
    emit('select', item);
};
</script>

<style scoped>
.sidebar {
    width: 64px;
    height: 100vh;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: 1px solid rgba(255, 255, 255, 0.6);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    box-shadow: 0 8px 32px 0 rgba(255, 154, 158, 0.08);
}

.sidebar-icons {
    display: flex;
    flex-direction: column;
    padding-top: 16px;
    gap: 8px;
}

.sidebar-bottom {
    display: flex;
    flex-direction: column;
    padding-bottom: 16px;
    gap: 8px;
}

.sidebar-icon-wrapper {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: rgba(93, 93, 93, 0.6);
    margin: 0 auto;
    border-radius: 16px;
}

.sidebar-icon-wrapper:hover {
    color: rgba(255, 154, 158, 0.9);
    background: rgba(255, 154, 158, 0.1);
    transform: translateY(-2px);
}

.sidebar-icon-wrapper.active {
    color: #ff9a9e;
    background: rgba(255, 154, 158, 0.15);
}

/* 激活指示条 - 圆形指示器 */
.sidebar-icon-wrapper.active::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
    border-radius: 50%;
}

.sidebar-icon {
    font-size: 22px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-icon-wrapper:hover .sidebar-icon {
    transform: scale(1.15);
}

.sidebar-icon-wrapper:active .sidebar-icon {
    transform: scale(0.9);
}
</style>
