import { Button } from '@/components/ui/button';
import { ArrowBigLeft, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { db } from '../db';
import { players } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { usePlayersStore } from '../store';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

function AddScores() {
  let params = useParams();
  const navigate = useNavigate();
  const [_players, _setPlayers] = useState([]);
  const { s_setPlayers } = usePlayersStore();
  const { toast } = useToast();

  const fetchPlayers = async () => {
    const data = await db.select().from(players).where(eq(players.group_id, params.groupId));
    _setPlayers(data.map((i) => ({ ...i, current_points: '' })));
    s_setPlayers(data.map((i) => ({ ...i, current_points: '' })));
  };

  useEffect(() => {
    fetchPlayers();
  }, [params]);

  const handleCurrentScore = (e, id) => {
    const { value } = e.target;
    const re = /^[0-9\b]+$/;
    if (value === '' || (re.test(value) && value >= 0 && value <= 100)) {
      _setPlayers(_players.map((user) => (user.id === id ? { ...user, current_points: value } : user)));
    }
  };

  const handleSaveScore = async () => {
    const data = _players.map((i) => ({ id: i.id, points: +i.points + +i.current_points, player_name: i.player_name }));
    console.log(data);
    try {
      await db.transaction(async (tx) => {
        data.length &&
          (await tx
            .insert(players)
            .values(data)
            .onConflictDoUpdate({
              target: players.id,
              set: { points: sql`excluded.points`, player_name: sql`excluded.player_name` },
            }));
      });

      // fetchPlayers();
      navigate(-1);
    } catch (err) {
      //
      console.log(err.message);
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
        Enter Scores
      </div>

      <div className='flex flex-col align-bottom pb-4'>
        <div className='flex flex-col items-start pt-4 pb-4 gap-2 flex-1'>
          {_players.length === 0 ? (
            <p>No players found</p>
          ) : (
            _players.map((i) => {
              return (
                <div key={i.id} className='flex  items-center gap-1'>
                  <Input value={i.player_name} disabled={true} />
                  <Input value={i.points} disabled={true} />
                  <Input
                    inputMode='numeric'
                    value={i.current_points}
                    onChange={(e) => handleCurrentScore(e, i.id)}
                    disabled={i.points >= 100}
                  />
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
              Save Scores
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddScores;
