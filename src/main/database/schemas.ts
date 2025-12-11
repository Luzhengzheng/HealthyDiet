import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const nutritionItems = sqliteTable('nutrition_items', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    quantity: real('quantity').notNull(),
    unit: text('unit').notNull(),
    energy_per_unit: real('energy_per_unit').notNull(),
    is_completed: integer('is_completed').notNull().default(0),
    completion_date: text('completion_date'),
    creation_date: text('creation_date').notNull(),
    notes: text('notes'),
});
