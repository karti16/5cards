import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowBigLeft, CircleCheck, Save, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PlayerLoader from '../components/player-loader';
import axios from 'axios';

function SelectPlayers() {
  let params = useParams();
  const navigate = useNavigate();
  const [_players, _setPlayers] = useState([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchPlayers = async () => {
    const _data = await axios.get(`/api/player/${params.groupId}`);
    const data = _data.data;
    _setPlayers(
      data.reduce((acc, curr) => {
        acc[curr.id] = curr.isPlaying;
        return acc;
      }, {}),
    );
    return data;
  };

  const { isPending, data: playerData } = useQuery({
    queryKey: ['selectPlayers'],
    queryFn: fetchPlayers,
  });

  const handleSaveScore = async () => {
    const data = playerData.map((i) => ({
      id: i.id,
      points: _players[i.id] ? +i.points + +i.current_points : null,
      player_name: i.player_name,
      isPlaying: _players[i.id],
    }));
    try {
      await axios.post(`/api/player/select`, {
        selectPlayers: data,
      });
      queryClient.invalidateQueries(['selectPlayers']);
      navigate(-1);
    } catch {
      toast({
        variant: 'red',
        title: 'Cannot select player',
      });
    }
  };

  const handleSelect = (id) => {
    _setPlayers({ ..._players, [id]: !_players[id] });
  };

  return (
    <div className='p-6 '>
      <div className='flex gap-6 pt-10 pb-10'>
        <ArrowBigLeft className='text-green-600 cursor-pointer' onClick={() => navigate(-1)} />
        Select players
      </div>

      <div className='flex flex-col align-bottom pb-4'>
        <div className='flex flex-col items-start pt-4 pb-6 gap-2 flex-1'>
          {!isPending && playerData.length === 0 ? (
            <p>No players found</p>
          ) : isPending ? (
            <PlayerLoader />
          ) : (
            <>
              {playerData.map((i) => {
                return (
                  <div
                    key={i.id}
                    className={cn('flex items-center gap-3  w-full p-2 rounded-md cursor-pointer')}
                    onClick={() => handleSelect(i.id)}
                  >
                    <CircleCheck className={cn(_players[i.id] ? 'text-green-700' : 'text-gray-900')} />
                    {i.player_name}
                  </div>
                );
              })}
            </>
          )}
        </div>
        {!isPending && playerData.length > 0 && (
          <div className='flex flex-row justify-between'>
            <Button variant='secondary' onClick={() => navigate(-1)}>
              <X />
              Cancel
            </Button>
            <Button onClick={handleSaveScore}>
              <Save />
              Save Players
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectPlayers;
