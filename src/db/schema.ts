import { int, sqliteTable, text, integer, unique, primaryKey } from 'drizzle-orm/sqlite-core';

export const groups = sqliteTable('groups', {
  id: int().primaryKey({ autoIncrement: true }),
  group_id: text().notNull().unique(),
});

export const players = sqliteTable(
  'players',
  {
    id: text().notNull().primaryKey(),
    group_id: text('group_id').references(() => groups.group_id),
    player_name: text().notNull(),
    points: int(),
  },
  (t) => ({
    unq: unique().on(t.group_id, t.player_name),
  }),
);
