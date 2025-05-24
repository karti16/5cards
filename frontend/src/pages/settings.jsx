import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowBigLeft, CircleX, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { AlertDialogWrapper } from '../components/alertDialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function Settings() {
  const navigate = useNavigate();
  let params = useParams();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleClearGame = async () => {
    await axios.post(`/api/round/clearGame`, { groupId: params.groupId });
    queryClient.invalidateQueries(['playerScore', 'currentRoundCount']);
    queryClient.removeQueries();
    toast({
      variant: 'green',
      title: 'Sores cleared',
    });
    navigate(-1);
  };
  const handleDeleteGroup = async () => {
    await axios.delete(`/api/group/${params.groupId}`);

    toast({
      variant: 'green',
      title: 'Group Deleted',
    });

    navigate('/');
  };
  return (
    <div className='p-6'>
      <div className='flex gap-6 pt-10 pb-10 text-green-600'>
        <ArrowBigLeft className='text-green-600 cursor-pointer' onClick={() => navigate(-1)} />
        Settings
      </div>
      <div className='flex flex-col items-start gap-4'>
        <Button variant='ghost' onClick={() => navigate('add-players')} className='focus:ring-2 focus:ring-green-800'>
          <Plus />
          Manage players
        </Button>
        <Button variant='ghost' onClick={() => setClearDialogOpen(true)} className='focus:ring-2 focus:ring-green-800'>
          <Trash2 />
          Clear game
        </Button>
        <Button
          variant='ghost'
          onClick={() => setDeleteGroupDialogOpen(true)}
          className='focus:ring-2 focus:ring-green-800'
        >
          <CircleX />
          Delete group
        </Button>
      </div>
      <AlertDialogWrapper
        handleConfirm={handleClearGame}
        open={clearDialogOpen}
        setOpen={setClearDialogOpen}
        description={'This cannot be undone. All scores will be deleted'}
        confirmButtonTitle={'Clear Game'}
        cancelButtonTitle={'Cancel'}
      />
      <AlertDialogWrapper
        handleConfirm={handleDeleteGroup}
        open={deleteGroupDialogOpen}
        setOpen={setDeleteGroupDialogOpen}
        description={'This cannot be undone. Group, players and all scores will be deleted'}
        confirmButtonTitle={'Delete All'}
        cancelButtonTitle={'Cancel'}
      />
    </div>
  );
}

export default Settings;
