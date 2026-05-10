import { useState } from "react";
import { api } from "../services/api";

const priority = ["Low", "Medium", "High"];
const status = ["Todo", "In Progress", "Done"];

function TaskCreate({ projectId, members = [], onTaskCreate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Todo",
    assignedTo: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.dueDate) {
      setError("Please fill all required fields");
      return;
    }

    try {
      console.log(form);
      console.log(projectId);

      const res = await api.post("/tasks", { ...form, projectId });
      alert("Task Created Successfully");

      if (onTaskCreate) {
        onTaskCreate();
      }

      setForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "",
        status: "",
        assignedTo: "",
      });
      setError("");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 bg-gradient-to-r from-gray-500 to-purple-600">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Create a Task
        </h1>
        <form action="" onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <textarea
            name="description"
            placeholder="Task Description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />

          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {priority.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {status.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Assign User</option>
            {members.map((member) => (
              <option value={member.user._id} key={member.user._id}>
                {member.user.name} ({member.role})
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600
            text-white py-3 rounded-md hover:opacity-90 transition font-medium
            disabled:opacity-50 cursor-pointer"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskCreate;
