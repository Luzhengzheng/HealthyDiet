import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const nutritionItems = sqliteTable('nutrition_items', {
    // TODO: 根据Database.ts中的SQL语句补全完善下方数据库表结构
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    quantity: real('quantity').notNull(),
    unit: text('unit').notNull(),
});
