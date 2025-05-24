import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

const Layout = () => {
  return (
    <div className=''>
      <main>
        <Outlet />
        <Toaster />
      </main>
    </div>
  );
};

export default Layout;
