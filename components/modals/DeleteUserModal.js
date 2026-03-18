import axiosClient from "@/lib/axiosClient";
import { Close } from "@mui/icons-material";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { PuffLoader } from "react-spinners";

export default function DeleteUserModal({ onClose }) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  if (!session) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosClient.delete('/api/user/delete');
    } catch (error) {
      setTimeout(() => setError("An error occurred, please try again"), 3000);
    } finally {
      setLoading(false);
      signOut({ callbackUrl: "/" });
    }
  }
  const handleBackgroundClick = (e) => {
        if (e.target.id === "deleteUserModalBackground") {
          onClose();
        }
    };
  return createPortal (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]" 
        id="deleteUserModalBackground"
        onClick={handleBackgroundClick}
    >
      <div className="bg-white p-10 rounded-sm shadow-lg w-full max-w-md relative" >
        <button onClick={onClose} className="absolute top-3 left-3 text-gray-500 hover:text-black">
          <Close />
        </button>
        <h2 className="text-2xl text-center font-bold">Confirm User Deletion</h2>
        <p className="text-center text-gray-600">
          Deleting your account will remove all your data. This action cannot be undone.
        </p>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-between items-center mt-10">
          <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-sm ">
            Cancel
          </button>
          <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-sm">
            {loading ? (<PuffLoader color="#fff" size={20} />) : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
    , document.getElementById('delete-user-modal-root')
  );
}
