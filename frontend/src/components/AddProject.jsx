import { useState } from "react";
import { api } from "../services/api";

function AddProject({ onProjectCreate }) {
  const [form, setForm] = useState({
    name: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const res = await api.post("/projects", form);

      alert("Project Created Successfully");

      if (onProjectCreate) {
        onProjectCreate(res.data);
      }

      setForm({
        name: "",
      });

      setError("");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 bg-gradient-to-r from-gray-500 to-purple-600">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Create Project
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="text"
            name="name"
            placeholder="Project Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 
            text-white py-3 rounded-md hover:opacity-90 transition font-medium cursor-pointer"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProject;
