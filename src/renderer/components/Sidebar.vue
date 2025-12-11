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
        label: '记录饮食',
        icon: FormOutlined,
        type: 'page',
    },
    {
        key: 'list',
        label: '记录列表',
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
    width: 48px;
    height: 100vh;
    background: rgba(30, 30, 46, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
}

.sidebar-icons {
    display: flex;
    flex-direction: column;
    padding-top: 8px;
}

.sidebar-bottom {
    display: flex;
    flex-direction: column;
    padding-bottom: 8px;
}

.sidebar-icon-wrapper {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
    color: rgba(255, 255, 255, 0.5);
}

.sidebar-icon-wrapper:hover {
    color: rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.05);
}

.sidebar-icon-wrapper.active {
    color: #fff;
}

/* 左侧激活指示条 */
.sidebar-icon-wrapper.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: 24px;
    background: linear-gradient(180deg, #ff9a9e 0%, #fecfef 100%);
    border-radius: 0 2px 2px 0;
}

.sidebar-icon {
    font-size: 22px;
    transition: transform 0.2s ease;
}

.sidebar-icon-wrapper:hover .sidebar-icon {
    transform: scale(1.1);
}

.sidebar-icon-wrapper:active .sidebar-icon {
    transform: scale(0.95);
}
</style>
