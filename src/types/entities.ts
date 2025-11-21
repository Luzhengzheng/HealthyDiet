export interface NutritionItemEntity {
    id: number; // ID
    name: string; // 名称
    quantity: number; // 数量
    unit: string; // 单位
    energyPerUnit: number; // 每单位能量值
    isCompleted: boolean; // 是否已完成
    completionDate: Date | null; // 完成日期
    creationDate: Date; // 创建日期
    note: string | null; // 备注
}
