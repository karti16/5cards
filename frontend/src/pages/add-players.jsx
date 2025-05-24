import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowBigLeft, CirclePlus, Info, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router';
import { usePlayersStore } from '../store';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

function capitalizeName(name) {
  return name.replace(/\b(\w)/g, (s) => s.toUpperCase());
}

function AddPlayers() {
  let params = useParams();
  const navigate = useNavigate();
  const [_players, _setPlayers] = useState([]);
  const { s_setPlayers } = usePlayersStore();
  const [deletePlayer, setDeletePlayer] = useState([]);
  const { toast } = useToast();

  const fetchPlayers = async () => {
    const _data = await axios.get(`/api/player/${params.groupId}`);
    const data = _data.data;
    _setPlayers(data);
    s_setPlayers(data);
  };

  useEffect(() => {
    fetchPlayers();
  }, [params]);

  const handlePlayer = (e, id) => {
    const { value } = e.target;
    _setPlayers(_players.map((user) => (user.id === id ? { ...user, player_name: value } : user)));
  };

  const handleRemovePlayer = (id) => {
    _setPlayers(_players.filter((user) => user.id !== id));
    setDeletePlayer([...deletePlayer, id]);
  };

  const handleAddPlayer = () => {
    _setPlayers([..._players, { id: uuidv4(), player_name: '', group_id: params.groupId }]);
  };

  const handleSavePlayer = async () => {
    const data = _players
      .filter((i) => i.player_name)
      .map((i) => ({ id: i.id, group_id: i.group_id, player_name: capitalizeName(i.player_name) }));
    try {
      await axios.post(`/api/player`, {
        insertPlayer: data,
        deletePlayer: deletePlayer,
      });
      fetchPlayers();
      setDeletePlayer([]);

      toast({
        variant: 'green',
        title: 'Saved',
      });
    } catch {
      toast({
        variant: 'red',
        title: 'Name already exist',
      });
    }
  };
  return (
    <div className='p-6 '>
      <div className='flex gap-6 pt-10 pb-10'>
        <ArrowBigLeft className='text-green-600 cursor-pointer' onClick={() => navigate(-1)} />
        Add Players
      </div>

      <div className='flex flex-col align-bottom pb-4'>
        <div className='flex flex-col items-start pt-4 pb-4 gap-2 flex-1'>
          {_players.map((i) => {
            return (
              <div key={i.id} className='flex justify-between items-center gap-6'>
                <Input value={i.player_name} onChange={(e) => handlePlayer(e, i.id)} />
                <NavLink to={`/group/${params.groupId}/player/${i.id}`}>
                  <Button variant='ghost' className='text-gray-400'>
                    <Info />
                  </Button>
                </NavLink>
                <Button variant='ghost' className='text-gray-400' onClick={() => handleRemovePlayer(i.id)}>
                  <Trash2 />
                </Button>
              </div>
            );
          })}

          <Button variant='secondary' onClick={handleAddPlayer} className='mb-8'>
            <CirclePlus />
            Add player
          </Button>
        </div>
        <div className='flex flex-row justify-between'>
          <Button variant='secondary' onClick={() => navigate(-1)}>
            <X />
            Cancel
          </Button>
          <Button onClick={handleSavePlayer}>
            <Save />
            Save players
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddPlayers;
