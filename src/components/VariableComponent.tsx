import React, { useState } from 'react';
import { api } from '~/utils/api';
import CameraLoading from './LoadingAnimation/CameraLoading';

interface Variable {
  id: number;
  key: string;
  value: string;
}

const VariableComponent: React.FC = () => {
  const { data: variables, isLoading, refetch } = api.variables.getAll.useQuery<Variable[]>();
  const updateKeyMutation = api.variables.updateKey.useMutation();
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleEdit = (variable: Variable) => {
    setEditId(variable.id);
    setEditValue(variable.value);
  };

  const handleSave = async (variable: Variable) => {
    let updatedValue = editValue;

    // Handle transformations
    if (variable.key.startsWith('Day-')) {
      if (isNaN(new Date(editValue).getTime())) {
        alert('Invalid date format');
        return;
      }
    } else if (variable.key === 'CountDown-Capture') {
      const date = new Date(editValue);
      if (isNaN(date.getTime())) {
        alert('Invalid date and time');
        return;
      }
      updatedValue = date.toISOString();
    } else if (variable.key === 'capture-auto-request') {
      if (!['ON', 'OFF'].includes(editValue)) {
        alert('Value must be ON or OFF');
        return;
      }
    }

    // Update backend
    await updateKeyMutation.mutateAsync({
      key: variable.key,
      value: updatedValue,
    });
    setEditId(null);
    setEditValue('');
    refetch();
  };

  if (isLoading) {
    return <CameraLoading />;
  }

  return (
    <div className="p-4">
      <h1 className="flex justify-center text-6xl font-Hunters mb-8 py-5 text-center">Variables</h1>
      <table className="min-w-full border border-gray-300 bg-black">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Key</th>
            <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Value</th>
            <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {variables?.map((variable: Variable) => (
            <tr key={variable.id}>
              <td className="py-2 px-4 border-b border-slate-700 text-center">{variable.key}</td>
              <td className="py-2 px-4 border-b border-slate-700 text-center">
                {editId === variable.id ? (
                  <>
                    {variable.key.startsWith('Day-') ? (
                      // Use type="date" for Day-1, Day-2, Day-3
                      <input
                        type="date"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full border px-2 py-1 text-black"
                      />
                    ) : variable.key === 'CountDown-Capture' ? (
                      // Use type="datetime-local" for CountDown-Capture
                      <input
                        type="datetime-local"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full border px-2 py-1 text-black"
                      />
                    ) : variable.key === 'capture-auto-request' ? (
                      // Use a select dropdown for capture-auto-request
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full border px-2 py-1 text-black"
                      >
                        <option value="ON">ON</option>
                        <option value="OFF">OFF</option>
                      </select>
                    ) : (
                      // Default input type for other keys
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full border px-2 py-1"
                      />
                    )}
                  </>
                ) : (
                  variable.value
                )}
              </td>
              <td className="py-2 px-4 border-b border-slate-700 text-center">
                {editId === variable.id ? (
                  <button
                    onClick={() => handleSave(variable)}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(variable)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VariableComponent;
