import { useState } from "react";
import { api } from "../services/api";
import { useEffect } from "react";
import AddProject from "../components/AddProject";
import TaskCreate from "../components/TaskCreate";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AddMember from "../components/AddMember";
import TaskCard from "../components/TaskCard";

function DashBoard() {
  const [dashBoard, setDashBoard] = useState({
    totalTasks: "",
    statusTask: {},
    taskPerUser: {},
    dueTask: 0,
  });

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectProject, setSelectProject] = useState(null);
  const [project, setProject] = useState([]);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const fetchDashBoard = async (id) => {
    try {
      const res = await api.get(`/tasks/dashboard/${id}`);

      setDashBoard(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProject = async () => {
    try {
      const res = await api.get("/projects");

      setProject(res.data.projects);
      setLoading(false);
      return res.data.projects;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const res = await api.get(`/tasks?projectId=${projectId}`);
      setTasks(res.data.tasks);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectProject?._id) {
      fetchDashBoard(selectProject?._id);
      fetchTasks(selectProject._id);
    } else {
      setTasks([]);
    }
  }, [selectProject]);

  useEffect(() => {
    fetchProject();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    alert("Logged out Successfully");
    navigate("/");
  };

  const handleRemove = async (userId) => {
    try {
      await api.delete(
        `/projects/${selectProject._id}/remove-member/${userId}`,
      );
      alert("Member Removed");

      const res = await api.get("/projects");
      setProject(res.data.projects);

      const updatedProject = res.data.projects.find(
        (p) => p._id === selectProject._id,
      );
      setSelectProject(updatedProject);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/tasks/${id}`, { status });
      fetchTasks(selectProject._id);
      fetchDashBoard(selectProject._id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMemberAdd = async () => {
    try {
      const updatedProject = await fetchProject();

      const updatedMember = updatedProject.find(
        (m) => m._id === selectProject._id,
      );
      setSelectProject(updatedMember);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-3 sm:p-4 md:p-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center lg:text-left">
          Project Dashboard
        </h1>
        <div className="flex flex-wrap justify-center lg:justify-end gap-3">
          <button
            onClick={() => setShowProjectForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer text-sm sm:text-base"
          >
            Add Project
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
        {project.map((p) => (
          <div
            key={p._id}
            className={`rounded-xl shadow-md p-4 sm:p-6 w-full transition-all ${selectProject?._id === p._id ? "bg-indigo-100 border-2 border-indigo-500" : "bg-white"}`}
          >
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-gray-500 mt-2">Members: {p.members.length}</p>
            <button
              onClick={() => {
                setSelectProject(p);
                fetchDashBoard(p._id);
                fetchTasks(p._id);
              }}
              className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
            >
              Open Project
            </button>
            {selectProject?._id === p._id && (
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
                >
                  Create Task
                </button>

                <button
                  onClick={() => setShowMemberForm(true)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                >
                  Add Member
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectProject && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Project Members</h2>
          <div className="space-y-3">
            {selectProject.members.map((member) => (
              <div
                key={member.user._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{member.user.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>

                {member.role !== "admin" && (
                  <button
                    onClick={() => handleRemove(member.user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showProjectForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-xl p-4 w-[95%] sm:w-[90%] md:w-[700px] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowProjectForm(!showProjectForm)}
              className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full cursor-pointer"
            >
              X
            </button>
            <AddProject
              onProjectCreate={() => {
                fetchProject();
                setShowProjectForm(false);
              }}
            />
          </div>
        </div>
      )}

      {showTaskForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-xl p-4 w-[95%] sm:w-[90%] md:w-[700px] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full cursor-pointer"
            >
              X
            </button>
            <TaskCreate
              projectId={selectProject?._id}
              members={selectProject?.members || []}
              onTaskCreate={() => {
                fetchTasks(selectProject?._id);
                fetchDashBoard(selectProject?._id);
                setShowTaskForm(false);
              }}
            />
          </div>
        </div>
      )}

      {showMemberForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 relative w-[400px]">
            <button
              onClick={() => setShowMemberForm(!showMemberForm)}
              className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full cursor-pointer"
            >
              X
            </button>
            <AddMember
              projectId={selectProject?._id}
              onClose={() => setShowMemberForm(false)}
              onMemberAdd={handleMemberAdd}
            />
          </div>
        </div>
      )}

      {selectProject && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center sm:text-left">
            Project Tasks
          </h2>
          {tasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-700">
                No Task Created
              </h2>

              <p className="text-gray-500 mt-2">
                Create a task for this project
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!selectProject && (
        <div className="bg-white text-2xl rounded-xl shadow-md p-6 text-center text-gray-600 mb-6">
          Select a project to view dashboard details
        </div>
      )}

      <h2 className="text-2xl font-bold text-white mb-6 mt-10 text-center sm:text-left">
        Project Analytics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-gray-500 text-sm">Total Tasks</h2>
          <p className="text-3xl font-bold mt-2">{dashBoard.totalTasks}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-gray-500 text-sm">Task Todo</h2>
          <p className="text-3xl font-bold mt-2">
            {dashBoard.statusTask?.Todo || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-gray-500 text-sm">Task In Progress</h2>
          <p className="text-3xl font-bold mt-2">
            {dashBoard.statusTask["In Progress"] || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-gray-500 text-sm">Completed Task</h2>
          <p className="text-3xl font-bold mt-2">
            {dashBoard.statusTask?.Done || 0}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Task Per User</h2>
          <div className="space-y-3">
            {Object.entries(dashBoard.taskPerUser || {}).map(
              ([userId, count]) => (
                <div
                  key={userId}
                  className="flex justify-between border-b pb-2"
                >
                  <span className="text-gray-700">{userId}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ),
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Overdue Task</h2>
          <div className="flex items-center justify-center h-[150px]">
            <p className="text-5xl font-bold text-red-500">
              {dashBoard.dueTask}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
