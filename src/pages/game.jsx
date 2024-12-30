import { NavLink, useParams } from 'react-router';
import Header from '../components/header';
import { Button } from '@/components/ui/button';
import { players, rounds } from '../db/schema';
import { and, asc, eq, or, sql } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { db } from '../db';
import { cn } from '@/lib/utils';
import { Check, FileInput, List } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ListViewScore from '../components/list-view-score';
import TableViewScore from '../components/table-view-score';

export default function Game() {
  let params = useParams();
  const [_players, _setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [_playersTableView, _setPlayersTableView] = useState([]);

  const fetchPlayers = async () => {
    try {
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

      console.log(data);
      _setPlayers(data);
    } catch (err) {
      //
      console.log(err);
    } finally {
      // setLoading(false);
    }
  };

  const fetchPlayersTableView = async () => {
    try {
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

      // console.log(data);
      _setPlayersTableView(data);
    } catch (err) {
      //
      console.log(err);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPlayers();
    fetchPlayersTableView();
  }, [params]);

  // if (loading) {
  //   return (
  //     <div className='flex items-center space-x-4'>
  //       <Skeleton className='h-12 w-12 rounded-full' />
  //       <div className='space-y-2'>
  //         <Skeleton className='h-4 w-[250px]' />
  //         <Skeleton className='h-4 w-[200px]' />
  //       </div>
  //     </div>
  //   );
  // }
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

      {view === 'list' ? <ListViewScore _players={_players} /> : <TableViewScore _players={_playersTableView} />}
    </div>
  );
}
