import { useNavigate, useParams } from 'react-router';
import { players, rounds } from '../db/schema';
import { and, asc, eq, or, sql } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { db } from '../db';
import { Button } from '@/components/ui/button';
import { ArrowBigLeft } from 'lucide-react';

export default function PlayerStats() {
  let params = useParams();
  const [_players, _setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('table');
  const [_playersTableView, _setPlayersTableView] = useState([]);
  const navigate = useNavigate();

  const fetchPlayers = async () => {
    try {
      const data = await db.select().from(players).where(eq(players.id, params.player_id));
      _setPlayers(data[0]);
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
  }, [params]);

  console.log({ _players });

  return (
    <div className='p-6'>
      <div className='flex gap-6 pt-10 pb-10 text-green-600'>
        <ArrowBigLeft className='text-green-600 cursor-pointer' onClick={() => navigate(-1)} />
        Player stats
      </div>

      <div className='flex '>
        {/* desc */}
        <div className='flex flex-col items-start pr-4 gap-4'>
          <div>Name</div>
          <div>Total Games played</div>
          <div>Total Games Won</div>
          <div>Total Rounds Won</div>
          <div>Total Wrong claims</div>
        </div>
        {/* values */}
        <div className='flex flex-col items-start gap-4'>
          <div>{_players.player_name}</div>
          <div>{_players.totalGamesPlayed}</div>
          <div>{_players.totalGamesWon}</div>
          <div>{_players.totalRoundsWon}</div>
          <div>{_players.totalWrongClaims}</div>
        </div>
      </div>
    </div>
  );
}
