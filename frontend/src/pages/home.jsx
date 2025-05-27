import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { groups } from '../../../server/db/schema';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router';
import { useGroupIdStore } from '../store/index';
import LoadingSpinner from '../components/loadingSpinner';
import axios from 'axios';

function Home() {


  let navigate = useNavigate();
  const [isGroupExist, setIsGroupExist] = useState(false);
  const [groupId, setGroupId] = useState('');
  const [notValidGroupId, setNotValidGroupId] = useState(null);
  const { s_setGroupId } = useGroupIdStore();
  const [loading, setLoading] = useState(false);

  const handleNewGame = async () => {
    if (!groupId) return;

    const regex = /^[a-zA-Z0-9]{5}$/;

    if (!regex.test(groupId)) {
      setNotValidGroupId(true);
      return;
    }

    try {
      const data = { group_id: groupId, created_at: new Date() };
      await axios.post(`/api/group`, { data });
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
    setGroupId(value.toLowerCase());
    setIsGroupExist(false);
    setNotValidGroupId(false);
  };

  const findGame = async () => {
    setNotValidGroupId(false);
    setIsGroupExist(false);
    setLoading(true);
    try {
      const _tempGroupsExists = await axios.get(`/api/group/findById/${groupId}`);
      const tempGroupExists = _tempGroupsExists.data.length > 0;
      if (tempGroupExists) {
        s_setGroupId(groupId);
        navigate(`/group/${groupId}`);
      } else {
        setIsGroupExist(true);
        setLoading(false);
      }
    } catch {
      //
    }
  };

  return (
    <div className='flex flex-col min-h-screen justify-center items-center p-6'>
      <h1 className='pb-10 text-[30px]'>
        {' '}
        🖐 <span className='text-green-500'>5 cards test 100</span>{' '}
      </h1>
      <Input
        onChange={handleInput}
        value={groupId}
        placeholder='Unique name'
        className={cn(isGroupExist && 'border-red-500')}
      />
      {!!notValidGroupId && <p className='text-red-300 text-sm pt-2'>An alphanumeric word with 🖐 5 characters</p>}
      {!!isGroupExist && <p className='text-red-500 text-sm pt-2'>Group not found</p>}
      <div className='card flex gap-2'>
        <Button
          variant='outline'
          onClick={findGame} 
          className='focus:ring-2 focus:ring-green-800 grid [grid-template-areas:"stack"] place-content-center'
        >
          <span
            aria-label='Find group'
            className={cn('[grid-area:stack]', loading ? '[visibility:visible]' : '[visibility:hidden]')}
          >
            <LoadingSpinner />
          </span>
          <span className={cn('[grid-area:stack]', loading ? '[visibility:hidden]' : '[visibility:visible]')}>
            Find group
          </span>
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
