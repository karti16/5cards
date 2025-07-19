const { eq, sql, and, asc, inArray, desc } = require('drizzle-orm');
const express = require('express');
const router = express.Router();
const db = require('../db/index.js').db;
const { groups, players, rounds } = require('../db/schema.js');

router.post('/currentRoundCount', async (req, res) => {
  const { groupId } = req.body;
  try {
    const data = await db
      .select({ round_count: rounds.round_count })
      .from(rounds)
      .where(eq(rounds.group_id, groupId))
      .orderBy(desc(rounds.id));
    return res.send(data[0]?.round_count ?? 0);
  } catch (error) {
    console.error('Error fetching latest round count:', error);
    return res.status(500).send({
      message: 'Error fetching latest round count',
      error: error.message,
    });
  }
});

router.post('/saveScore', async (req, res) => {
  const { playersWonRounds, playersWrongClaims, playerScore } = req.body;
  try {
    await db.transaction(async (tx) => {
      playerScore.length && (await tx.insert(rounds).values(playerScore));
      playersWonRounds.length &&
        (await tx
          .update(players)
          .set({ totalRoundsWon: sql`${players.totalRoundsWon} + 1` })
          .where(inArray(players.id, playersWonRounds)));
      playersWrongClaims.length &&
        (await tx
          .update(players)
          .set({ totalWrongClaims: sql`${players.totalWrongClaims} + 1` })
          .where(inArray(players.id, playersWrongClaims)));
    });
    return res.send({
      message: 'Scores saved successfully',
    });
  } catch (error) {
    console.error('Error saving scores:', error);
    return res.status(500).send({
      message: 'Error saving scores',
      error: error.message,
    });
  }
});

router.delete('/:currentRoundCount', async (req, res) => {
  const { currentRoundCount } = req.params;
  try {
    await db.delete(rounds).where(eq(rounds.round_count, currentRoundCount));
    return res.send({
      message: 'Scores deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting scores:', error);
    return res.status(500).send({
      message: 'Error deleting scores',
      error: error.message,
    });
  }
});

router.post('/playerScore', async (req, res) => {
  const { groupId } = req.body;
  try {
    const data = await db
      .select({
        player_name: players.player_name,
        id: players.id,
        points: sql`cast(sum(${rounds.points}) as int)`,
        group_id: players.group_id,
      })
      .from(players)
      .leftJoin(rounds, eq(players.id, rounds.player_id))
      .where(and(eq(players.group_id, groupId), eq(players.isPlaying, true)))
      .groupBy(players.id);
    return res.send(data);
  } catch (error) {
    console.error('Error fetching player scores:', error);
    return res.status(500).send({
      message: 'Error fetching player scores',
      error: error.message,
    });
  }
});

router.post('/clearGame', async (req, res) => {
  const { groupId } = req.body;
  try {
    await db.transaction(async (tx) => {
      await tx
        .update(players)
        .set({ totalGamesPlayed: sql`${players.totalGamesPlayed} + 1` })
        .where(and(eq(players.group_id, groupId), eq(players.isPlaying, true)));
      const won = await db
        .select({
          player_name: players.player_name,
          id: players.id,
          points: sql`cast(sum(${rounds.points}) as int)`,
        })
        .from(players)
        .leftJoin(rounds, eq(players.id, rounds.player_id))
        .where(and(eq(players.group_id, groupId), eq(players.isPlaying, true)))
        .groupBy(players.id)
        .orderBy(({ points, player_name }) => [asc(points), asc(player_name)])
        .limit(1);
      won.length &&
        (await tx
          .update(players)
          .set({ totalGamesWon: sql`${players.totalGamesWon} + 1` })
          .where(and(eq(players.group_id, groupId), eq(players.isPlaying, true), eq(players.id, won[0].id))));
      await tx.delete(rounds).where(eq(rounds.group_id, groupId));
    });
    return res.send({
      message: 'Scores cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing game scores:', error);
    return res.status(500).send({
      message: 'Error clearing game scores',
      error: error.message,
    });
  }
});

module.exports = router;
