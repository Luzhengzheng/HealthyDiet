export interface NutritionItemDTO {
    id?: number; // ID
    name: string; // 名称
    quantity: number; // 数量
    unit: string; // 单位
    energyPerUnit: number; // 每单位能量值
    isCompleted: boolean; // 是否已完成
    completionDate?: Date; // 完成日期
    creationDate: Date; // 创建日期
    note?: string; // 备注

    // protein?: number; //蛋白质
    // fat?: number;  //脂肪
    // carbohydrates?: number; //碳水化合物
}

export type createNutritionItemRequest = Omit<
    NutritionItemDTO,
    'id' | 'completionDate' | 'creationDate' | 'isCompleted'
>;
