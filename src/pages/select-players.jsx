import { Button } from '@/components/ui/button';
import { ArrowBigLeft, CircleCheck, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { db } from '../db';
import { players } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function SelectPlayers() {
  let params = useParams();
  const navigate = useNavigate();
  const [_players, _setPlayers] = useState([]);
  const { toast } = useToast();

  const fetchPlayers = async () => {
    const data = await db.select().from(players).where(eq(players.group_id, params.groupId));
    _setPlayers(data.map((i) => ({ ...i, current_points: '' })));
  };

  useEffect(() => {
    fetchPlayers();
  }, [params]);

  const handleSaveScore = async () => {
    const data = _players.map((i) => ({
      id: i.id,
      points: i.isPlaying ? +i.points + +i.current_points : null,
      player_name: i.player_name,
      isPlaying: i.isPlaying,
    }));
    console.log(data);
    try {
      await db.transaction(async (tx) => {
        data.length &&
          (await tx
            .insert(players)
            .values(data)
            .onConflictDoUpdate({
              target: players.id,
              set: {
                points: sql`excluded.points`,
                player_name: sql`excluded.player_name`,
                isPlaying: sql`excluded.isPlaying`,
              },
            }));
      });

      navigate(-1);
    } catch (err) {
      //
      console.log(err.message);
      toast({
        variant: 'red',
        title: 'Cannot select player',
      });
    }
  };

  const handleSelect = (id, isPlaying) => {
    _setPlayers(_players.map((user) => (user.id === id ? { ...user, isPlaying: !isPlaying } : user)));
  };

  return (
    <div className='p-6 '>
      <div className='flex gap-6 pt-10 pb-10'>
        <ArrowBigLeft className='text-green-600 cursor-pointer' onClick={() => navigate(-1)} />
        Select players
      </div>

      <div className='flex flex-col align-bottom pb-4'>
        <div className='flex flex-col items-start pt-4 pb-6 gap-2 flex-1'>
          {_players.length === 0 ? (
            <p>No players found</p>
          ) : (
            _players.map((i) => {
              return (
                <div
                  key={i.id}
                  className={cn('flex items-center gap-3  w-full p-2 rounded-md cursor-pointer')}
                  onClick={() => handleSelect(i.id, i.isPlaying)}
                >
                  <CircleCheck className={cn(i.isPlaying ? 'text-green-700' : 'text-gray-900')} />
                  {i.player_name}
                </div>
              );
            })
          )}
        </div>
        {_players.length > 0 && (
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
