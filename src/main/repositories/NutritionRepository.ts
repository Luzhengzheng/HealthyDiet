import { NutritionItemEntity } from '../../types/entities';

export class NutritionRepository {
    // 在此处实现与数据库交互的方法

    async createTables(): Promise<void> {}

    async addNutritionItem(): Promise<void> {}
    async deleteNutritionItem(): Promise<void> {}
    async updateNutritionItem(): Promise<void> {}
    async getAllNutritionItems(): Promise<void> {}
    async getNutritionItemById(): Promise<void> {}
    async getNutritionItemsByDate(): Promise<void> {}

    async markNutritionItemCompleted(): Promise<void> {}

    private map2Entity(row: any): NutritionItemEntity {
        return {
            id: row.id,
            name: row.name,
            quantity: row.quantity,
            unit: row.unit,
            energyPerUnit: row.energy_per_unit,
            isCompleted: row.is_completed === 1,
            completionDate: row.completion_date,
            creationDate: row.creation_date,
            notes: row.notes,
        };
    }
}
