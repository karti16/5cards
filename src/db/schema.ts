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
    isPlaying: integer({ mode: 'boolean' }),
    totalGamesPlayed: int().default(0),
    totalRoundsWon: int().default(0),
    totalGamesWon: int().default(0),
    totalWrongClaims: int().default(0),
  },
  (t) => ({
    unq: unique().on(t.group_id, t.player_name),
  }),
);

export const rounds = sqliteTable('rounds', {
  id: int().primaryKey({ autoIncrement: true }),
  round_count: int(),
  group_id: text('group_id').references(() => groups.group_id),
  player_id: text('player_id').references(() => players.id),
  points: int(),
});
