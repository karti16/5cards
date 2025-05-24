import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { ArrowBigLeft } from 'lucide-react';
import axios from 'axios';  

export default function PlayerStats() {
  let params = useParams();
  const [_players, _setPlayers] = useState([]);
  const navigate = useNavigate();

  const fetchPlayers = async () => {
    try {
      const _data = await axios.get(`/api/player/score/${params.player_id}`);
      const data = _data.data;
      _setPlayers(data);
    } catch {
      //
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [params]);

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
