import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    due_date: '',
    start_date: '',
    section: '',
    assignee: '',
    priority: 'Medium',
    progress: 'Not Started'
  });

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create or update task
  const saveTask = async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      return response.data;
    } catch (err) {
      console.error('Error saving task:', err);
      throw err;
    }
  };

  // Delete task - not supported for this CSV structure
  const deleteTask = async (taskId) => {
    setError('Deleting tasks not supported. Only due date updates allowed.');
  };

  // Handle inline editing
  const handleEdit = (task) => {
    setEditingTask({ ...task });
  };

  const handleSave = async () => {
    if (!editingTask) return;

    try {
      const updatedTask = await saveTask(editingTask);
      setTasks(tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
      setEditingTask(null);
    } catch (err) {
      setError('Failed to save task');
    }
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  // Handle date change without auto-save
  const handleDateChange = (newDate) => {
    if (editingTask) {
      setEditingTask({ ...editingTask, due_date: newDate });
    }
  };

  // Add new task
  const handleAddTask = async () => {
    if (!newTask.name.trim() || !newTask.due_date) {
      setError('Please fill in task name and due date');
      return;
    }

    try {
      const taskData = {
        name: newTask.name,
        due_date: newTask.due_date,
        start_date: newTask.start_date,
        section: newTask.section,
        assignee: newTask.assignee,
        priority: newTask.priority,
        progress: newTask.progress
      };
      
      const savedTask = await saveTask(taskData);
      setTasks([...tasks, savedTask]);
      setNewTask({
        name: '',
        due_date: '',
        start_date: '',
        section: '',
        assignee: '',
        priority: 'Medium',
        progress: 'Not Started'
      });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Remove auto-save - let user manually save

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Project Data - Due Date Adjuster
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Weekend Adjustment</h3>
          <p className="text-blue-800">
            Click on any due date to edit it. Due dates falling on weekends are automatically adjusted:
          </p>
          <ul className="text-blue-800 mt-2 list-disc list-inside">
            <li>Saturday → Monday (+2 days)</li>
            <li>Sunday → Monday (+1 day)</li>
          </ul>
        </div>

        {/* Add New Task Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {showAddForm ? 'Cancel' : 'Add New Task'}
          </button>
        </div>

        {/* Add New Task Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Name *</label>
                <input
                  type="text"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={newTask.start_date}
                  onChange={(e) => setNewTask({ ...newTask, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <input
                  type="text"
                  value={newTask.section}
                  onChange={(e) => setNewTask({ ...newTask, section: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Planning, In Progress"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <input
                  type="text"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Assignee name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Progress</label>
                <select
                  value={newTask.progress}
                  onChange={(e) => setNewTask({ ...newTask, progress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleAddTask}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tasks Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Project Tasks</h2>
          </div>
          
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No tasks found in project_data.csv
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task ID
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Section
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignee
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {task.id}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={task.name}>
                          {task.name}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {task.section}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {task.assignee}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {task.start_date}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingTask && editingTask.id === task.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              value={editingTask.due_date}
                              onChange={(e) => handleDateChange(e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={handleSave}
                              className="text-green-600 hover:text-green-900 text-xs"
                              title="Save"
                            >
                              ✓
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-red-600 hover:text-red-900 text-xs"
                              title="Cancel"
                            >
                              ✗
                            </button>
                          </div>
                        ) : (
                          <span 
                            onClick={() => handleEdit(task)} 
                            className="cursor-pointer hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                            title="Click to edit due date"
                          >
                            {task.due_date}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          task.priority === 'Low' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.progress === 'Done' ? 'bg-green-100 text-green-800' :
                          task.progress === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          task.progress === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                          task.progress === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.progress || 'Not Started'}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                        {editingTask && editingTask.id === task.id ? (
                          <span className="text-gray-500 text-xs">Editing...</span>
                        ) : (
                          <button
                            onClick={() => handleEdit(task)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit Due Date
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
