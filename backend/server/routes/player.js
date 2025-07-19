const { eq, sql, and, asc, inArray } = require('drizzle-orm');
const express = require('express');
const router = express.Router();
const db = require('../db/index.js').db;
const { groups, players, rounds } = require('../db/schema.js');

const findPlayersGridView = async (groupId) => {
  const _players = await db
    .select({
      player_name: players.player_name,
      id: players.id,
      points: sql`cast(sum(${rounds.points}) as int)`,
    })
    .from(players)
    .leftJoin(rounds, eq(players.id, rounds.player_id))
    .where(and(eq(players.group_id, groupId), eq(players.isPlaying, true)))
    .groupBy(players.id)
    .orderBy(({ points, player_name }) => [asc(points), asc(player_name)]);

  return _players;
};

const findPlayersTableView = async (groupId) => {
  const _players = await db
    .select({
      player_name: players.player_name,
      id: players.id,
      round_count: rounds.round_count,
      points: rounds.points,
    })
    .from(players)
    .leftJoin(rounds, eq(players.id, rounds.player_id))
    .where(and(eq(players.group_id, groupId), eq(players.isPlaying, true)));

  return _players;
};

router.post('/score', async (req, res) => {
  const { groupId, view } = req.body;
  try {
    const data = view === 'grid-view' ? await findPlayersGridView(groupId) : await findPlayersTableView(groupId);
    return res.send(data);
  } catch (error) {
    console.error('Error finding players score:', error);
    return res.status(500).send({
      message: 'Error finding players score',
      error: error.message,
    });
  }
});

router.get('/score/:playerId', async (req, res) => {
  const { playerId } = req.params;
  try {
    const data = await db.select().from(players).where(eq(players.id, playerId));
    return res.send(data[0]);
  } catch (error) {
    console.error('Error finding player by ID:', error);
    return res.status(500).send({
      message: 'Error finding player by ID',
      error: error.message,
    });
  }
});

router.post('/select', async (req, res) => {
  const { selectPlayers } = req.body;
  try {
    await db.transaction(async (tx) => {
      selectPlayers.length &&
        (await tx
          .insert(players)
          .values(selectPlayers)
          .onConflictDoUpdate({
            target: players.id,
            set: {
              points: sql`excluded."points"`,
              player_name: sql`excluded."player_name"`,
              isPlaying: sql`excluded."isPlaying"`,
            },
          }));
    });
    return res.send({
      message: 'Players selected successfully',
    });
  } catch (error) {
    console.error('Error selecting players:', error);
    return res.status(500).send({
      message: 'Error selecting players',
      error: error.message,
    });
  }
});

router.get('/:groupId', async (req, res) => {
  const { groupId } = req.params;
  try {
    const data = await db.select().from(players).where(eq(players.group_id, groupId));
    return res.send(data);
  } catch (error) {
    console.error('Error finding players by group ID:', error);
    return res.status(500).send({
      message: 'Error finding players by group ID',
      error: error.message,
    });
  }
});

router.post('/', async (req, res) => {
  const { groupId } = req.params;
  const { insertPlayer, deletePlayer } = req.body;
  try {
    await db.transaction(async (tx) => {
      insertPlayer.length &&
        (await tx
          .insert(players)
          .values(insertPlayer)
          .onConflictDoUpdate({ target: players.id, set: { player_name: sql`excluded.player_name` } }));
      deletePlayer.length && (await tx.delete(players).where(inArray(players.id, deletePlayer)));
    });
    return res.send({
      message: 'Players updated successfully',
    });
  } catch (error) {
    console.error('Error updating players:', error);
    return res.status(500).send({
      message: 'Error updating players',
      error: error.message,
    });
  }
});

module.exports = router;
