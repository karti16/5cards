import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowBigLeft, Save, Undo2, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '../lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertDialogWrapper } from '../components/alertDialog';
import PlayerLoader from '../components/player-loader';
import axios from 'axios';

function AddScores() {
  let params = useParams();
  const navigate = useNavigate();
  const [_players, _setPlayers] = useState({});
  const { toast } = useToast();
  const [undoScoreDialogueOpen, setUndoScoreDialogue] = useState(false);
  const queryClient = useQueryClient();

  const fetchCurrentRoundCount = async () => {
    const _data = await axios.post(`/api/round/currentRoundCount`, { groupId: params.groupId });
    return _data.data;
  };

  const { data: currentRoundCount } = useQuery({
    queryKey: ['currentRoundCount'],
    queryFn: fetchCurrentRoundCount,
  });

  const handleSaveScore = async () => {
    const data = playerScore.map((i) => ({
      round_count: currentRoundCount + 1,
      group_id: i.group_id,
      player_id: i.id,
      points: _players[i.id] === '' ? null : +_players[i.id],
    }));

    const playersWonRounds = data.filter((i) => i.points === 0).map((i) => i.player_id);
    const playersWrongClaims = data.filter((i) => i.points === 40).map((i) => i.player_id);

    try {
      await axios.post(`/api/round/saveScore`, {
        playersWonRounds,
        playersWrongClaims,
        playerScore: data,
      });
    } catch {
      toast({
        variant: 'red',
        title: 'Name already exist',
      });
    }
  };

  const handleUndoScore = async () => {
    await axios.delete(`/api/round/${currentRoundCount}`);
  };

  const saveScoreMutation = useMutation({
    mutationFn: handleSaveScore,
    onSuccess: () => {
      queryClient.invalidateQueries(['playerScore', 'currentRoundCount']);
      navigate(-1);
    },
  });

  const undoScoreMutation = useMutation({
    mutationFn: handleUndoScore,
    onSuccess: () => {
      queryClient.invalidateQueries(['playerScore', 'currentRoundCount']);
      toast({
        variant: 'green',
        title: 'Success undo last round',
      });
    },
  });

  const fetchPlayers = async () => {
    const _data = await axios.post(`/api/round/playerScore`, { groupId: params.groupId });
    const data = _data.data;
    _setPlayers(
      data.reduce((acc, curr) => {
        acc[curr.id] = '';
        return acc;
      }, {}),
    );
    return data;
  };

  const { isPending, data: playerScore } = useQuery({
    queryKey: ['playerScore'],
    queryFn: fetchPlayers,
  });

  const handleCurrentScore = (e, id) => {
    const { value } = e.target;
    const re = /^[0-9\b]+$/;
    if (value === '' || (re.test(value) && value >= 0 && value <= 100)) {
      _setPlayers({ ..._players, [id]: value });
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
          {!isPending && playerScore.length === 0 ? (
            <p>No players found</p>
          ) : (
            <>
              <Button
                onClick={() => setUndoScoreDialogue(true)}
                disabled={undoScoreMutation.isPending}
                className={cn('bg-red-500 hover:bg-red-600 text-white mb-4')}
              >
                <Undo2 />
                Undo last round
              </Button>
              {isPending ? (
                <PlayerLoader />
              ) : (
                <>
                  {playerScore
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
                            value={i.points ?? ''}
                            disabled={true}
                            className={cn('border-0', isOutOfGame && 'line-through')}
                          />
                          <Input
                            inputMode='numeric'
                            value={_players[i.id] ?? ''}
                            onChange={(e) => handleCurrentScore(e, i.id)}
                            disabled={isOutOfGame}
                          />
                        </div>
                      );
                    })}
                  {playerScore
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
                            value={i.points ?? ''}
                            disabled={true}
                            className={cn('border-0', isOutOfGame && 'line-through text-gray-600')}
                          />
                          {
                            <Input
                              inputMode='numeric'
                              value={_players[i.id] ?? ''}
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
            </>
          )}
        </div>
        {!isPending && (
          <div className='flex flex-row justify-between'>
            <Button variant='secondary' onClick={() => navigate(-1)}>
              <X />
              Cancel
            </Button>
            <Button onClick={saveScoreMutation.mutate} disabled={saveScoreMutation.isPending}>
              <Save />
              Save Scores
            </Button>
          </div>
        )}
      </div>
      <AlertDialogWrapper
        handleConfirm={undoScoreMutation.mutate}
        open={undoScoreDialogueOpen}
        setOpen={setUndoScoreDialogue}
        description={'This cannot be undone. Last round score will be deleted'}
        confirmButtonTitle={'Undo Last Round'}
        cancelButtonTitle={'Cancel'}
      />
    </div>
  );
}

export default AddScores;
