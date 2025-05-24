import { integer, pgTable, text, unique, serial, boolean } from 'drizzle-orm/pg-core';

export const groups = pgTable('groups', {
  id: serial().primaryKey(),
  group_id: text().notNull().unique(),
});

export const players = pgTable(
  'players',
  {
    id: text().notNull().primaryKey(),
    group_id: text('group_id').references(() => groups.group_id),
    player_name: text().notNull(),
    isPlaying: boolean(),
    totalGamesPlayed: integer().default(0),
    totalRoundsWon: integer().default(0),
    totalGamesWon: integer().default(0),
    totalWrongClaims: integer().default(0),
  },
  (t) => ({
    unq: unique().on(t.group_id, t.player_name),
  }),
);

export const rounds = pgTable('rounds', {
  id: serial().primaryKey(),
  round_count: integer(),
  group_id: text('group_id').references(() => groups.group_id),
  player_id: text('player_id').references(() => players.id),
  points: integer(),
});

