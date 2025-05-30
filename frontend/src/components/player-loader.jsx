import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PlayerLoader() {
  return (
    <div className='pt-10'>
      {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => {
        return (
          <div className='flex items-center space-x-4 pt-6' key={i}>
            <Skeleton className='h-12 w-12 rounded-full' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[250px]' />
              <Skeleton className='h-4 w-[200px]' />
            </div>
          </div>
        );
      })}
    </div>
  );
}
