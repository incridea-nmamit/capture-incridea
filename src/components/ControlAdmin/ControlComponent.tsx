import React, { useState } from 'react';
import { api } from '~/utils/api';
import CameraLoading from '../LoadingAnimation/CameraLoading';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import ExecuteEvents from '../ExecuteTabAdmin/ExecuteEvents';

// Interface for variable data structure
interface Variable {
  id: number;
  key: string;
  value: string;
}

/**
 * ControlComponent - Admin control panel for managing system variables
 * Handles editing and updating of system configuration variables
 */
const ControlComponent: React.FC = () => {
  // API queries and mutations
  const { data: variables, isLoading, refetch } = api.variables.getAll.useQuery<Variable[]>();
  const updateKeyMutation = api.variables.updateKey.useMutation();
  const auditLogMutation = api.audit.log.useMutation();
  
  // State management
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const { data: session } = useSession();

  // Handler functions
  const handleEdit = (variable: Variable) => {
    setEditId(variable.id);
    setEditValue(variable.value);
  };

  const handleSave = async (variable: Variable) => {
    // Input validation and value transformation
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
    }
    try {
      // Update backend
      await updateKeyMutation.mutateAsync({
        key: variable.key,
        value: updatedValue,
      });
      await auditLogMutation.mutateAsync({
        sessionUser: session?.user.name || "Invalid User", //Invalid user is not reachable
        description: `${variable.key} set to ${variable.value}`,
        audit:'ControlManagementAudit'
      });
      toast.success(`${variable.key} set to ${variable.value}`)
      setEditId(null);
      setEditValue('');
      refetch();
    } catch (error) {
      toast.error("Couldnt change the value");
    }
  };

  if (isLoading) {
    return <CameraLoading />;
  }

  return (
    <div className=" md:p-4 p-2 items-center justify-center mx-auto">
      <h1 className="flex justify-center text-4xl font-Teknaf mb-8 py-5 text-center">
        Control Center
      </h1>
      <div className="overflow-x-auto ">
        <table className="min-w-full border border-gray-300 bg-neutral-950 font-Trap-Regular text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-black border border-gray-300 py-2 px-4 text-center">
                Key
              </th>
              <th className="text-black border border-gray-300 py-2 px-4 text-center">
                Value
              </th>
              <th className="text-black border border-gray-300 py-2 px-4 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {variables?.map((variable: Variable) => (
              <tr key={variable.id}>
                <td className="py-2 px-4 border-b border-slate-700 text-center">
                  {variable.key}
                </td>
                <td className="py-2 px-4 border-b border-slate-700 text-center">
                  {editId === variable.id ? (
                    <>
                      {variable.key.startsWith("Day-") ? (
                        <div className="relative">
                          <input
                            type="date"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full border px-2 py-1 text-white bg-black custom-date"
                          />
                          <style jsx>{`
                        .custom-date::-webkit-calendar-picker-indicator {
                          filter: invert(100%) brightness(150%);
                          cursor: pointer;
                        }
                      `}</style>
                        </div>
                      ) : variable.key === "CountDown-Capture" ? (
                        <div className="relative">
                          <input
                            type="datetime-local"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full border px-2 py-1 text-white bg-black custom-datetime"
                          />
                          <style jsx>{`
                        .custom-datetime::-webkit-calendar-picker-indicator {
                          filter: invert(100%) brightness(150%);
                          cursor: pointer;
                        }
                      `}</style>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full border px-2 py-1"
                        />
                      )}
                    </>
                  ) : variable.key === "capture-auto-request" ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={variable.value === "ON"}
                        onChange={async () => {
                          const newValue =
                            variable.value === "ON" ? "OFF" : "ON";
                          await updateKeyMutation.mutateAsync({
                            key: variable.key,
                            value: newValue,
                          });
                          await auditLogMutation.mutateAsync({
                            sessionUser: session?.user.name || "Invalid User",
                            description: `Capture Auto-Request set to ${newValue}`,
                            audit:'ControlManagementAudit'
                          });
                          toast.success(
                            `Capture Auto-Request set to ${newValue}`
                          );
                          refetch();
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-red-500 peer-checked:bg-green-500 rounded-full peer-focus:ring-2 peer-focus:ring-green-300 transition"></div>
                      <div className="absolute top-0.5 left-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  ) : (
                    variable.value
                  )}
                </td>
                <td className="py-2 px-4 border-b border-slate-700 text-center">
                  {editId === variable.id &&
                    variable.key !== "capture-auto-request" ? (
                    <button
                      onClick={() => handleSave(variable)}
                      className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Save
                    </button>
                  ) : variable.key !== "capture-auto-request" ? (
                    <button
                      onClick={() => handleEdit(variable)}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ExecuteEvents />
    </div>

  );
};

export default ControlComponent;
