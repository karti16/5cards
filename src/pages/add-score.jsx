import { Button } from '@/components/ui/button';
import { ArrowBigLeft, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { db } from '../db';
import { players, rounds } from '../db/schema';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { usePlayersStore } from '../store';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '../lib/utils';

function AddScores() {
  let params = useParams();
  const navigate = useNavigate();
  const [_players, _setPlayers] = useState([]);
  const { toast } = useToast();
  const [currentRoundCount, setCurrentRoundCount] = useState(null);

  const fetchPlayers = async () => {
    const data = await db
      .select({
        player_name: players.player_name,
        id: players.id,
        points: sql`cast(sum(${rounds.points}) as int)`,
        group_id: players.group_id,
      })
      .from(players)
      .leftJoin(rounds, eq(players.id, rounds.player_id))
      .where(and(eq(players.group_id, params.groupId), eq(players.isPlaying, 1)))
      .groupBy(players.id);

    console.log(data);
    _setPlayers(data.map((i) => ({ ...i, current_points: '' })));
  };

  const fetchCurrentRoundCount = async () => {
    const data = await db
      .select({ round_count: rounds.round_count })
      .from(rounds)
      .where(eq(rounds.group_id, params.groupId))
      .orderBy(desc(rounds.id));

    setCurrentRoundCount(data[0]?.round_count ?? 0);
  };

  useEffect(() => {
    fetchPlayers();
    fetchCurrentRoundCount();
  }, [params]);

  const handleCurrentScore = (e, id) => {
    const { value } = e.target;
    const re = /^[0-9\b]+$/;
    if (value === '' || (re.test(value) && value >= 0 && value <= 100)) {
      _setPlayers(_players.map((user) => (user.id === id ? { ...user, current_points: value } : user)));
    }
  };

  const handleSaveScore = async () => {
    const data = _players.map((i) => ({
      round_count: currentRoundCount + 1,
      group_id: i.group_id,
      player_id: i.id,
      points: i.current_points === '' ? null : +i.current_points,
    }));

    const playersWonRounds = data.filter((i) => i.points === 0).map((i) => i.player_id);
    const playersWrongClaims = data.filter((i) => i.points === 40).map((i) => i.player_id);

    console.log({ playersWonRounds });
    console.log(data);
    try {
      await db.transaction(async (tx) => {
        data.length && (await tx.insert(rounds).values(data));
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

  console.log({ currentRoundCount });

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
            <>
              {_players
                .filter((i) => i.points < 100)
                .map((i) => {
                  const isOutOfGame = i.points >= 100;
                  return (
                    <div key={i.id} className='flex  items-center gap-1'>
                      <Input
                        value={i.player_name}
                        disabled={true}
                        className={cn('border-0', isOutOfGame && 'line-through')}
                      />
                      <Input
                        value={i.points}
                        disabled={true}
                        className={cn('border-0', isOutOfGame && 'line-through')}
                      />
                      <Input
                        inputMode='numeric'
                        value={i.current_points}
                        onChange={(e) => handleCurrentScore(e, i.id)}
                        disabled={isOutOfGame}
                      />
                    </div>
                  );
                })}
              {_players
                .filter((i) => i.points >= 100)
                .map((i) => {
                  const isOutOfGame = i.points >= 100;
                  return (
                    <div key={i.id} className='flex  items-center gap-1'>
                      <Input
                        value={i.player_name}
                        disabled={true}
                        className={cn('border-0', isOutOfGame && 'line-through text-gray-600')}
                      />
                      <Input
                        value={i.points}
                        disabled={true}
                        className={cn('border-0', isOutOfGame && 'line-through text-gray-600')}
                      />
                      {
                        <Input
                          inputMode='numeric'
                          value={i.current_points}
                          onChange={(e) => handleCurrentScore(e, i.id)}
                          disabled={isOutOfGame}
                          className={cn(isOutOfGame && 'border-0')}
                        />
                      }
                    </div>
                  );
                })}
            </>
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
