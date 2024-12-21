import { useState } from 'react';
import { db, isGroupInDB } from '../db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { groups } from '../db/schema';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router';
import { useGroupIdStore } from '../store/index';

function Home() {
  let navigate = useNavigate();
  const [isGroupExist, setIsGroupExist] = useState(false);
  const [groupId, setGroupId] = useState('');
  const [notValidGroupId, setNotValidGroupId] = useState(null);
  const { s_setGroupId } = useGroupIdStore();

  const handleNewGame = async () => {
    if (!groupId) return;

    const regex = /^[a-zA-Z0-9]{5}$/;

    if (!regex.test(groupId)) {
      setNotValidGroupId(true);
      return;
    }

    try {
      const data = { group_id: groupId, created_at: new Date() };
      await db.insert(groups).values(data);
      setIsGroupExist(false);
      setGroupId('');
      setNotValidGroupId(false);
      navigate(`/group/${groupId}`);
      s_setGroupId(groupId);
    } catch {
      setIsGroupExist(true);
    }
  };

  const handleInput = (e) => {
    const { value } = e.target;
    setGroupId(value);
    setIsGroupExist(false);
    setNotValidGroupId(false);
  };

  const findGame = async () => {
    setNotValidGroupId(false);
    setIsGroupExist(false);
    try {
      const tempGroupExists = await isGroupInDB(groupId);
      console.log(tempGroupExists);
      if (tempGroupExists) {
        console.log('ppppp');
        s_setGroupId(groupId);
        navigate(`/group/${groupId}`);
      } else {
        setIsGroupExist(true);
      }
    } catch {
      //
    }
  };

  return (
    <div className='flex flex-col min-h-screen justify-center items-center p-6'>
      <h1 className='pb-10 text-[30px]'>
        {' '}
        🖐 <span className='text-green-500'>5 cards</span>{' '}
      </h1>
      <Input
        onChange={handleInput}
        value={groupId}
        placeholder='Unique name'
        className={cn(isGroupExist && 'border-red-500')}
      />
      {!!notValidGroupId && <p className='text-red-300 text-sm pt-2'>An alphanumeric word with 🖐 5 characters</p>}
      {!!isGroupExist && <p className='text-red-500 text-sm pt-2'>Choose another name</p>}
      <div className='card flex gap-2'>
        <Button variant='outline' onClick={findGame} className='focus:ring-2 focus:ring-green-800'>
          Find group
        </Button>
        <Button onClick={handleNewGame} className='focus:ring-2 focus:ring-green-800 bg-green-600'>
          New group
        </Button>
      </div>
      <div className='text-sm text-gray-500'>
        <p>
          <span className='text-green-500'>Record points</span> for the 5 card game
        </p>
        <p>--✵--</p>
        <p>Create a group name to start</p>
      </div>
    </div>
  );
}

export default Home;
