/* eslint-disable react/prop-types */
import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function TableViewScore({ _players }) {
  if (_players.length === 0) return <p>No players found</p>;
  console.log(_players);

  let playersName = _players.filter((o, index, arr) => arr.findIndex((item) => item.id === o.id) === index);
  const temp_scores = playersName.map((i) => {
    const temp = _players.filter((j) => j.id === i.id).map((i) => i.points ?? '-');
    const total = temp.filter((i) => !isNaN(i)).reduce((a, b) => a + b, 0);
    temp.unshift(i.player_name);
    temp.push(total);
    return temp;
  });

  const maxRound = Math.max(...temp_scores.map((el) => el.length));

  const scores = temp_scores
    .map((arr) => {
      if (arr.length === maxRound) return arr;

      let arrLen = arr.length;
      for (let i = 0; i < maxRound - arrLen; i++) {
        arr.splice(arr.length - 2, 0, '-');
      }

      return arr;
    })
    .sort((a, b) => a[maxRound - 1] - b[maxRound - 1]);

  const firstCol = Array(maxRound - 1)
    .fill(0)
    .map((_, i) => {
      if (i === 0) return '__';
      return `R${i}`;
    });

  firstCol.push('Total');
  console.log({ scores, maxRound });

  return (
    <ScrollArea className='w-full whitespace-nowrap'>
      <div className='flex w-max space-x-4 '>
        <div className='pt-10'>
          <div className='flex flex-row border'>
            <div className='row'>
              {firstCol.map((fc, fidx, farr) => (
                <div
                  key={fidx}
                  className={cn('p-1  border-[1px]', fidx === farr.length - 1 && ' border-green-600 bg-[#1458261c]')}
                >
                  {fc}
                </div>
              ))}
            </div>
            {scores.map((sc, i) => {
              return (
                <div key={i} className='row'>
                  {sc.map((j, idx, arr) => {
                    return (
                      <div
                        key={idx}
                        className={cn(
                          'cell px-2 p-1 border-[1px]',
                          j === 0 && 'text-green-600',
                          j === '-' && 'text-gray-700',
                          i === 0 && ' border-green-600 bg-[#14582686]',
                          arr[arr.length - 1] >= 100 && ' border-green-600 bg-[#383b3979] text-gray-600',
                          idx === arr.length - 1 && ' border-green-600 bg-[#1458261c]',
                        )}
                      >
                        {j}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
