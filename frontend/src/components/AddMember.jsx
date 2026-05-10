import { useState } from "react";
import { api } from "../services/api";
import { useEffect } from "react";

function AddMember({ projectId, onClose, onMemberAdd }) {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/projects/${projectId}/add-member`, {
        userId,
      });

      alert("Member Added");

      if (onMemberAdd) await onMemberAdd();
      setUserId("");
      onClose();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleAdd} className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Add Members</h2>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="">Select Member</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
        >
          Add Member
        </button>
      </form>
    </div>
  );
}

export default AddMember;
