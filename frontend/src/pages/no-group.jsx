import React from 'react';
import { NavLink } from 'react-router';
import { Button } from '@/components/ui/button';

function NoGroup() {
  return (
    <div className='h-screen flex items-center justify-center'>
      <div>
        <p className='pb-6'>No group found.</p>
        <div>
          <NavLink to='/' end>
            <Button>Go to Home</Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default NoGroup;
