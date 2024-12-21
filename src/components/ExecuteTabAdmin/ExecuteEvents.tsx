import React, { useState } from 'react';
import { api } from '~/utils/api';
import CameraLoading from '../LoadingAnimation/CameraLoading';

interface Card {
  id: number;
  cardName: string;
  cardState: 'active' | 'inactive';
  cardRtime: Date; // Ensure consistency with backend
}

interface FormData {
  id: string;
  cardState: 'active' | 'inactive';
  cardExpiry: string; // Date formatted as a string (YYYY-MM-DD)
}

const ExecuteEvents = () => {
  const { data: cards, isLoading, refetch } = api.capturecard.getCards.useQuery();
  const updateCardMutation = api.capturecard.updateCardExpiry.useMutation({
    onSuccess: () => refetch(),
  });

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id: '',
    cardState: 'active',
    cardExpiry: '', // Ensure this is always a string
  });

  const handleRowDoubleClick = (card: Card) => {
    setSelectedCard(card);
    setFormData({
      id: card.id.toString(),
      cardState: card.cardState,
      cardExpiry: card.cardRtime?.toISOString().split('T')[0] ?? '', // Safely access cardRtime using optional chaining
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    const { id, cardState, cardExpiry } = formData;
    updateCardMutation.mutate({
      id: parseInt(id),
      CardState: cardState,
      cardExpiry: new Date(cardExpiry),
    });
    setIsModalOpen(false);
  };

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
            <th className="text-black border py-2 px-4 text-center">Card Expiry</th>
          </tr>
        </thead>
        <tbody>
          {cards?.map((card: Card) => (
            <tr
              key={card.id}
              className="cursor-pointer hover:bg-gray-700"
              onDoubleClick={() => handleRowDoubleClick(card)}
            >
              <td className="py-2 px-4 border text-center">{card.cardName}</td>
              <td className="py-2 px-4 border text-center">{card.cardState}</td>
              <td className="py-2 px-4 border text-center">
                {new Date(card.cardRtime).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-black p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Update Card</h2>
            <div className="mb-4">
              <label className="block font-medium">Card State</label>
              <select
                name="cardState"
                value={formData.cardState} // Removed unnecessary fallback
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 w-full text-black"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-medium">Card Expiry</label>
              <input
                type="datetime-local"
                name="cardExpiry"
                value={formData.cardExpiry}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 w-full text-black"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecuteEvents;
