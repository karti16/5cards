import { NavLink, useParams } from 'react-router';
import Header from '../components/header';
import { Button } from '@/components/ui/button';
import { players } from '../db/schema';
import { and, asc, eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { db } from '../db';
import { cn } from '@/lib/utils';
import { Check, FileInput } from 'lucide-react';

export default function Game() {
  let params = useParams();
  const [_players, _setPlayers] = useState([]);
  const fetchPlayers = async () => {
    const data = await db
      .select()
      .from(players)
      .where(and(eq(players.group_id, params.groupId), eq(players.isPlaying, 1)))
      .orderBy(asc(players.points));
    _setPlayers(data);
  };

  useEffect(() => {
    fetchPlayers();
  }, [params]);

  return (
    <div className='p-6'>
      <Header groupId={params.groupId} />
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
      <div className='pt-10'>
        {_players.length === 0 ? (
          <p>No players found</p>
        ) : (
          <>
            {_players
              .filter((i) => i.points < 100)
              .map((i, index) => {
                return (
                  <div
                    key={i.id}
                    className={cn(
                      'flex gap-5 content-center items-center pl-2 p-3 justify-between',
                      index === 0 &&
                        _players.some((i) => i.points) &&
                        'border border-green-600 bg-[#14582679] rounded-2xl',
                    )}
                  >
                    <div className='flex gap-5 content-center  items-center'>
                      <div className='items-center content-center text-center flex'>{i.points}</div>
                      <div className=''>{i.player_name}</div>
                    </div>
                    {index === 0 && _players.some((i) => i.points) && <div>🎖🎖🎖</div>}
                  </div>
                );
              })}
            <hr className='h-px my-8 bg-gray-200 border-0 dark:bg-gray-700'></hr>
            <p className='flex pb-5'>Out of the Game</p>
            {_players
              .filter((i) => i.points >= 100)
              .map((i) => {
                return (
                  <div key={i.id} className={cn('flex gap-5 content-center items-center pl-2 p-3 text-gray-600')}>
                    <div className='items-center content-center text-center flex'>{i.points}</div>
                    <div className=''>{i.player_name}</div>
                  </div>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}
