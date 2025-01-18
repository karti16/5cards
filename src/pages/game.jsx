import React from 'react';
import { NavLink, useParams } from 'react-router';
import Header from '../components/header';
import { Button } from '@/components/ui/button';
import { players, rounds } from '../db/schema';
import { and, asc, eq, sql } from 'drizzle-orm';
import { useState } from 'react';
import { db } from '../db';
import { Check, FileInput } from 'lucide-react';

import ListViewScore from '../components/list-view-score';
import TableViewScore from '../components/table-view-score';
import { useQuery } from '@tanstack/react-query';
import PlayerLoader from '../components/player-loader';

export default function Game() {
  let params = useParams();
  const [view, setView] = useState('list');

  const fetchPlayers = async () => {
    const data = await db
      .select({
        player_name: players.player_name,
        id: players.id,
        points: sql`cast(sum(${rounds.points}) as int)`,
      })
      .from(players)
      .leftJoin(rounds, eq(players.id, rounds.player_id))
      .where(and(eq(players.group_id, params.groupId), eq(players.isPlaying, 1)))
      .groupBy(players.id)
      .orderBy(({ points, player_name }) => [asc(points), asc(player_name)]);
    return data;
  };

  const fetchPlayersTableView = async () => {
    const data = await db
      .select({
        player_name: players.player_name,
        id: players.id,
        round_count: rounds.round_count,
        points: rounds.points,
      })
      .from(players)
      .leftJoin(rounds, eq(players.id, rounds.player_id))
      .where(and(eq(players.group_id, params.groupId), eq(players.isPlaying, 1)));

    return data;
  };

  const { isPending: fetchPlayersTableViewIsPending, data: _playersTableView } = useQuery({
    queryKey: ['playersTableView'],
    queryFn: fetchPlayersTableView,
  });

  const { isPending: fetchPlayersIsPending, data: _players } = useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayers,
  });

  const toggleView = () => {
    setView(view === 'list' ? 'table' : 'list');
  };
  return (
    <div className='p-6'>
      <Header groupId={params.groupId} view={view} toggleView={toggleView} />
      <div className='flex justify-between pt-10'>
        <NavLink to='add-scores'>
          <Button variant='ghost' className='focus:ring-2 focus:ring-green-800'>
            {' '}
            <FileInput className='text-green-500 text-lg flex gap-2' />
            Enter Score
          </Button>
        </NavLink>
        <NavLink to='select-players'>
          <Button variant='ghost' className='focus:ring-2 focus:ring-green-800'>
            <Check className='text-green-500 text-lg flex gap-2' />
            Select players
          </Button>
        </NavLink>
      </div>

      {fetchPlayersIsPending || fetchPlayersTableViewIsPending ? (
        <PlayerLoader />
      ) : view === 'list' ? (
        <ListViewScore _players={_players} />
      ) : (
        <TableViewScore _players={_playersTableView} />
      )}
    </div>
  );
}
