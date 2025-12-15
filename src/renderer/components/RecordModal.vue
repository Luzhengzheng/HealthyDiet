<template>
    <a-modal
        v-model:open="visible"
        :title="title"
        :okText="okText"
        cancelText="取消"
        @ok="handleOk"
        @cancel="handleCancel"
        centered
        :width="500"
    >
        <div class="record-modal-content">
            <!-- 数值输入和时间选择 -->
            <div class="input-row">
                <div class="input-item value-item">
                    <label class="input-label">{{ label || '数值' }}</label>
                    <a-input-number
                        v-model:value="inputValue"
                        :placeholder="`请输入${label || '数值'}`"
                        :min="min"
                        :max="max"
                        :step="step"
                        :precision="precision"
                        class="value-input"
                        size="large"
                        @pressEnter="handleOk"
                    />
                </div>
                <div class="input-item date-item">
                    <label class="input-label">时间</label>
                    <a-date-picker
                        v-model:value="recordDate"
                        show-time
                        format="YYYY-MM-DD HH:mm"
                        :allowClear="false"
                        size="large"
                        class="date-input"
                    />
                </div>
            </div>

            <!-- 单位选择 -->
            <div class="unit-group">
                <label class="input-label">单位</label>
                <a-radio-group v-model:value="selectedUnit" size="large" button-style="solid">
                    <a-radio-button v-for="unit in units" :key="unit.value" :value="unit.value">
                        {{ unit.label }}
                    </a-radio-button>
                </a-radio-group>
            </div>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import dayjs, { type Dayjs } from 'dayjs';

export interface Unit {
    label: string;
    value: string;
    // 转换为基础单位的系数
    factor?: number;
}

interface Props {
    open: boolean;
    title: string;
    label?: string;
    units: Unit[];
    defaultUnit?: string;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    okText?: string;
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
    title: '添加记录',
    label: '数值',
    defaultValue: undefined,
    min: 0,
    max: 99999,
    step: 1,
    precision: 1,
    okText: '确定',
});

const emit = defineEmits<{
    'update:open': [value: boolean];
    confirm: [value: number, unit: string, date: Dayjs];
    cancel: [];
}>();

const visible = ref(props.open);
const inputValue = ref<number | undefined>(props.defaultValue);
const selectedUnit = ref(props.defaultUnit || props.units[0]?.value || '');
const recordDate = ref<Dayjs>(dayjs());

// 监听 open 属性变化
watch(
    () => props.open,
    (newVal) => {
        visible.value = newVal;
        if (newVal) {
            // 重置输入值
            inputValue.value = props.defaultValue;
            selectedUnit.value = props.defaultUnit || props.units[0]?.value || '';
            recordDate.value = dayjs();
        }
    },
);

// 监听 visible 变化
watch(visible, (newVal) => {
    emit('update:open', newVal);
});

const handleOk = () => {
    if (inputValue.value === undefined || inputValue.value === null) {
        return;
    }
    emit('confirm', inputValue.value, selectedUnit.value, recordDate.value);
    visible.value = false;
};

const handleCancel = () => {
    emit('cancel');
    visible.value = false;
};
</script>

<style scoped>
.record-modal-content {
    padding: 16px 0;
}

.input-row {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
}

.input-item {
    display: flex;
    flex-direction: column;
}

.value-item {
    flex: 1;
}

.date-item {
    width: 200px;
}

.unit-group {
    margin-bottom: 0;
}

.input-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.value-input,
.date-input {
    width: 100%;
}

:deep(.ant-radio-group) {
    display: flex;
    gap: 8px;
}

:deep(.ant-radio-button-wrapper) {
    flex: 1;
    text-align: center;
}
</style>
