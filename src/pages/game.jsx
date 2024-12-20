import { NavLink, useParams } from 'react-router';
import Header from '../components/header';
import { Button } from '@/components/ui/button';
import { players } from '../db/schema';
import { asc, eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { db } from '../db';
import { cn } from '@/lib/utils';

export default function Game() {
  let params = useParams();
  const [_players, _setPlayers] = useState([]);
  const fetchPlayers = async () => {
    const data = await db
      .select()
      .from(players)
      .where(eq(players.group_id, params.groupId))
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
          <Button variant=''>Enter Score</Button>
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
                      'flex gap-5 content-center items-center pl-2 p-3',
                      index === 0 && _players.some((i) => i.points) && 'bg-green-600 rounded-2xl',
                    )}
                  >
                    <div className='items-center content-center text-center flex'>{i.points}</div>
                    <div className=''>{i.player_name}</div>
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