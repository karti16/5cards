import React from 'react';
import { NavLink, useParams } from 'react-router';
import Header from '../components/header';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Check, FileInput } from 'lucide-react';
import ListViewScore from '../components/list-view-score';
import TableViewScore from '../components/table-view-score';
import { useQuery } from '@tanstack/react-query';
import PlayerLoader from '../components/player-loader';
import axios from 'axios';

export default function Game() {
  let params = useParams();
  const [view, setView] = useState('list');

  const fetchPlayers = async () => {
    const data = await axios.post(`/api/player/score`, {
      groupId: params.groupId,
      view: 'grid-view',
    });
    return data.data;
  };

  const fetchPlayersTableView = async () => {
    const data = await axios.post(`/api/player/score`, {
      groupId: params.groupId,
      view: 'table-view',
    });
    return data.data;
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
