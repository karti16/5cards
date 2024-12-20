import { NavLink } from 'react-router';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, Users } from 'lucide-react';

function Header({ groupId }) {
  return (
    <div className='flex text-lg justify-between items-center'>
      <div className='text-green-500 text-lg flex gap-2'>
        <Users />
        {groupId}
      </div>
      <div className='flex justify-between gap-1 text-lg '>
        <NavLink to='settings' end>
          <Button variant='ghost' className='text-green-500'>
            <Settings />
          </Button>
        </NavLink>
        <NavLink to='/' end>
          <Button variant='ghost' className='text-green-500 '>
            <LogOut />
          </Button>
        </NavLink>
      </div>
    </div>
  );
}

export default Header;
