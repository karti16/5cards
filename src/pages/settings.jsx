import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowBigLeft, CircleX, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { db } from '../db';
import { groups, players, rounds } from '../db/schema';
import { and, asc, eq, sql } from 'drizzle-orm';
import { AlertDialogWrapper } from '../components/alertDialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

function Settings() {
  const navigate = useNavigate();
  let params = useParams();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleClearGame = async () => {
    await db.transaction(async (tx) => {
      await tx
        .update(players)
        .set({ totalGamesPlayed: sql`${players.totalGamesPlayed} + 1` })
        .where(and(eq(players.group_id, params.groupId), eq(players.isPlaying, 1)));
      const won = await db
        .select({
          player_name: players.player_name,
          id: players.id,
          points: sql`cast(sum(${rounds.points}) as int)`,
        })
        .from(players)
        .leftJoin(rounds, eq(players.id, rounds.player_id))
        .where(and(eq(players.group_id, params.groupId), eq(players.isPlaying, 1)))
        .groupBy(players.id)
        .orderBy(({ points, player_name }) => [asc(points), asc(player_name)])
        .limit(1);
      console.log({ won });
      won.length &&
        (await tx
          .update(players)
          .set({ totalGamesWon: sql`${players.totalGamesWon} + 1` })
          .where(and(eq(players.group_id, params.groupId), eq(players.isPlaying, 1), eq(players.id, won[0].id))));
      await tx.delete(rounds).where(eq(rounds.group_id, params.groupId));
    });
    toast({
      variant: 'green',
      title: 'Sores cleared',
    });
  };
  const handleDeleteGroup = async () => {
    await db.update(players).set({ points: null }).where(eq(players.group_id, params.groupId));

    await db.transaction(async (tx) => {
      await tx.delete(players).where(eq(players.group_id, params.groupId));
      await tx.delete(groups).where(eq(groups.group_id, params.groupId));
      await tx.delete(rounds).where(eq(rounds.group_id, params.groupId));
    });

    toast({
      variant: 'green',
      title: 'Group Deleted',
    });

    navigate('/');
  };
  return (
    <div className='p-6'>
      <div className='flex gap-6 pt-10 pb-10 text-green-600'>
        <ArrowBigLeft className='text-green-600 cursor-pointer' onClick={() => navigate(-1)} />
        Settings
      </div>
      <div className='flex flex-col items-start gap-4'>
        <Button variant='ghost' onClick={() => navigate('add-players')} className='focus:ring-2 focus:ring-green-800'>
          <Plus />
          Manage players
        </Button>
        <Button variant='ghost' onClick={() => setClearDialogOpen(true)} className='focus:ring-2 focus:ring-green-800'>
          <Trash2 />
          Clear game
        </Button>
        <Button
          variant='ghost'
          onClick={() => setDeleteGroupDialogOpen(true)}
          className='focus:ring-2 focus:ring-green-800'
        >
          <CircleX />
          Delete group
        </Button>
      </div>
      <AlertDialogWrapper
        handleConfirm={handleClearGame}
        open={clearDialogOpen}
        setOpen={setClearDialogOpen}
        description={'This cannot be undone. All scores will be deleted'}
        confirmButtonTitle={'Clear Game'}
        cancelButtonTitle={'Cancel'}
      />
      <AlertDialogWrapper
        handleConfirm={handleDeleteGroup}
        open={deleteGroupDialogOpen}
        setOpen={setDeleteGroupDialogOpen}
        description={'This cannot be undone. Group, players and all scores will be deleted'}
        confirmButtonTitle={'Delete All'}
        cancelButtonTitle={'Cancel'}
      />
    </div>
  );
}

export default Settings;
