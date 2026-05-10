
function TaskCard({ task, onStatusChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
          <p className="text-gray-500 mt-1">
            {task.description || "No description"}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm text-white ${
            task.priority === "High"
              ? "bg-red-00"
              : task.priority === "Medium"
                ? "bg-yellow-500"
                : "bg-green-500"
          }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none w-full sm:w-auto"
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700 shadow-sm w-full sm:w-auto text-center">
         📅 Due:{" "}
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No Date"}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
