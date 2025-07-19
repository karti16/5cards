const { eq } = require('drizzle-orm');
const express = require('express');
const router = express.Router();
const db = require('../db/index.js').db;
const { groups, players, rounds } = require('../db/schema.js');

router.post('/', async (req, res) => {
  try {
    const data = req.body.data;
    
    await db.insert(groups).values(data);
    return res.send({
      message: 'Group created successfully',
      groupId: data.group_id,
    });
  } catch (error) {
    console.error('Error creating group:', error);
    return res.status(500).send({
      message: 'Error creating group',
      error: error.message,
    });
  }
});

router.get('/findById/:groupId', async (req, res) => {
  try {
    const group = await db.select().from(groups).where(eq(groups.group_id, req.params.groupId));
    return res.send(group);
  } catch (error) {
    console.error('Error finding group:', error);
    return res.status(500).send({
      message: 'Error finding group',
      error: error.message,
    });
  }
});

router.delete('/:groupId', async (req, res) => {
  const { groupId } = req.params;
  try {
    await db.transaction(async (tx) => {
      await tx.delete(players).where(eq(players.group_id, groupId));
      await tx.delete(groups).where(eq(groups.group_id, groupId));
      await tx.delete(rounds).where(eq(rounds.group_id, groupId));
    });

    return res.send({
      message: 'Group deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting group:', error);
    return res.status(500).send({
      message: 'Error deleting group',
      error: error.message,
    });
  }
});

module.exports = router;
