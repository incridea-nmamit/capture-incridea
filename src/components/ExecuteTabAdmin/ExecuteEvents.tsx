import React from 'react';
import { api } from '~/utils/api';
import CameraLoading from '../LoadingAnimation/CameraLoading';

const ExecuteEvents = () => {
  const { data: cards, isLoading } = api.capturecard.getCards.useQuery();

  if (isLoading) {
    return <CameraLoading/>;
  }

  return (
    <div className="p-4">
      <h1 className="flex justify-center text-6xl font-Hunters mb-8 py-5 text-center">Execute Events</h1>
      <table className="min-w-full border border-gray-300 bg-black">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Card Name</th>
            <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Card State</th>
            <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Card Expiry</th>
          </tr>
        </thead>
        <tbody>
          {cards?.map((card) => (
            <tr key={card.id} className="c">
              <td className="py-2 px-4 border-b border-slate-700 text-center">{card.cardName}</td>
              <td className="py-2 px-4 border-b border-slate-700 text-center">{card.cardState}</td>
              <td className="py-2 px-4 border-b border-slate-700 text-center">
                {new Date(card.cardRtime).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExecuteEvents;
