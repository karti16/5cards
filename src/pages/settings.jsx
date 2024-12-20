import { Button } from '@/components/ui/button';
import { ArrowBigLeft, CircleX, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { db } from '../db';
import { groups, players } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AlertDialogWrapper } from '../components/alertDialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

function Settings() {
  const navigate = useNavigate();
  let params = useParams();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleClearGame = async () => {
    await db.update(players).set({ points: null }).where(eq(players.group_id, params.groupId));
    toast({
      variant: 'green',
      title: 'Sores cleared',
    });
  };
  const handleDeleteGroup = async () => {
    await db.update(players).set({ points: null }).where(eq(players.group_id, params.groupId));

    await db.transaction(async (tx) => {
      await tx.delete(players).where(eq(players.group_id, params.groupId));
      await tx.delete(groups).where(eq(groups.group_id, params.groupId));
    });

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
      <div className='flex flex-col items-start'>
        <Button variant='outlined' onClick={() => navigate('add-players')}>
          <Plus />
          Manage players
        </Button>
        <Button variant='outlined' onClick={() => setClearDialogOpen(true)}>
          <Trash2 />
          Clear game
        </Button>
        <Button variant='outlined' onClick={() => setDeleteGroupDialogOpen(true)}>
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
