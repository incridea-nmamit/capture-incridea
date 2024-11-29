import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

const ResetDB = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPass, setResetPass] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: variableData } = api.variables.getVariable.useQuery({ key: "reset-pass" });
  const updateKey = api.variables.updateKey.useMutation();

  useEffect(() => {
    if (variableData?.value) {
      setResetPass(variableData.value);
    }
  }, [variableData]);

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    if (password === resetPass) {
      setIsAuthenticated(true);
    } else {
      toast.error("Incorrect password");
    }
  };

  const handleNewPasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    if (newPassword === confirmPassword) {
      updateKey.mutate(
        { key: "reset-pass", value: newPassword },
        {
          onSuccess: () => {
            setResetPass(newPassword);
            toast.success("Password Changed !"); // Update the resetPass with new password
          },
        }
      );
    } else {
      toast.error("Passwords do not match");
    }
  };

  return (
    <div className="flex items-start justify-center h-screen w-full">
      {isAuthenticated ? (
        <div className="flex justify-start">
          <div className="w-full p-8 rounded-lg shadow-lg text-white animate__animated animate__fadeIn">
            <h2 className="flex justify-center text-6xl font-Hunters mb-8 py-5 text-center">Reset Database</h2>
          </div>
        </div>
      ) : (
        <div className="bg-black p-8 rounded-lg flex justify-center items-center shadow-lg text-white animate__animated animate__fadeIn w-full h-screen">
          {resetPass === "default" ? (
            <form onSubmit={handleNewPasswordSubmit}>
              <h2 className="text-2xl font-bold mb-4">Change Password</h2>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mb-2 p-2 w-full border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring focus:ring-pink-500"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mb-4 p-2 w-full border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring focus:ring-pink-500"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold p-2 rounded w-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
              >
                Submit
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              <h2 className="text-2xl font-bold mb-4">Login</h2>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 p-2 w-full border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring focus:ring-pink-500"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold p-2 rounded w-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ResetDB;
