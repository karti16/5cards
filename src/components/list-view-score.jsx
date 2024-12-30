import { NavLink, useParams } from 'react-router';
import Header from './header';
import { Button } from '@/components/ui/button';
import { players, rounds } from '../db/schema';
import { and, asc, eq, sql } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { db } from '../db';
import { cn } from '@/lib/utils';
import { Check, FileInput } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ListViewScore({ _players }) {
  return (
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
                    <NavLink to={`player/${i.id}`}>
                      <div className=''>{i.player_name}</div>
                    </NavLink>
                  </div>
                  {index === 0 && _players.some((i) => i.points) && <div>🎖🎖🎖</div>}
                </div>
              );
            })}
          <span className='text-gray-600 text-sm'>
            No. of players still in game : {_players.filter((i) => i.points < 100).length}
          </span>
          <hr className='h-px my-4 bg-gray-200 border-0 dark:bg-gray-700'></hr>
          <p className='flex pb-5'>Out of the Game</p>
          {_players
            .filter((i) => i.points >= 100)
            .map((i) => {
              console.log('ddddd', i);
              return (
                <div key={i.id} className={cn('flex gap-5 content-center items-center pl-2 p-3 text-gray-600')}>
                  <div className='items-center content-center text-center flex'>{i.points}</div>
                  <NavLink to={`player/${i.id}`}>
                    <div className=''>{i.player_name}</div>
                  </NavLink>
                </div>
              );
            })}
        </>
      )}
    </div>
  );
}