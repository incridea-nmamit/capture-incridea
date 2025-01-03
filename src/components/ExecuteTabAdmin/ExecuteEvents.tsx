import React, { useState } from 'react';
import { api } from '~/utils/api';
import CameraLoading from '../LoadingAnimation/CameraLoading';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Card {
  id: number;
  cardName: string;
  cardState: 'active' | 'inactive';
}


const ExecuteEvents = () => {
  const { data: cards, isLoading, refetch } = api.capturecard.getCards.useQuery();
  const auditLogMutation = api.audit.log.useMutation();
  const { data: session } = useSession();
  const updateVisibility = api.capturecard.updateCardVisibility.useMutation();
  if (isLoading) {
    return <CameraLoading />;
  }

  return (
    <div className="py-4">
      <table className="min-w-full border border-gray-300 bg-primary-950/50">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-black border py-2 px-4 text-center">Card Name</th>
            <th className="text-black border py-2 px-4 text-center">Card State</th>
          </tr>
        </thead>
        <tbody>
          {cards?.map((card: Card) => (
            <tr
              key={card.id}
              className="cursor-pointer hover:bg-gray-700"
            >
              <td className="py-2 px-4 border text-center">{card.cardName}</td>
              <td className="py-2 px-4 border text-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={card.cardState === 'active'}
                    onChange={async () => {
                      const newValue = card.cardState === 'active' ? 'inactive' : 'active';
                      const id = card.id;
                      const cardName = card.cardName;
                      await updateVisibility.mutateAsync({ cardName, newValue });
                      await auditLogMutation.mutateAsync({
                        sessionUser: session?.user.name || 'Invalid User',
                        description: `CaptureCardManagementAudit - ${name} is set to ${newValue}`,
                      });
                      toast.success(`${name} visibility set to ${newValue}`);
                      refetch();
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-red-500 peer-checked:bg-green-500 rounded-full peer-focus:ring-2 peer-focus:ring-green-300 transition"></div>
                  <div className="absolute top-0.5 left-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExecuteEvents;
