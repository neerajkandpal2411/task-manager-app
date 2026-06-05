import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import FilterButtons from './components/FilterButtons';
import { fetchTasks, createTask, updateTask, deleteTask } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      const createdTask = await createTask(newTask);
      setTasks([createdTask, ...tasks]);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const updatedTask = await updateTask(id, { completed });
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleEditTask = async (id, updates) => {
    try {
      const updatedTask = await updateTask(id, updates);
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (err) {
      setError('Failed to edit task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'Active') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  // Calculate counts
  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Task Manager</h1>
        
        {/* Task Statistics */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
          <span className="text-gray-600">📋 Total: {tasks.length} tasks</span>
          <div className="flex gap-4">
            <span className="text-green-600">✓ Completed: {completedCount}</span>
            <span className="text-orange-600">○ Active: {activeCount}</span>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
            <button onClick={loadTasks} className="ml-4 underline">Retry</button>
          </div>
        )}
        
        <TaskForm onAddTask={handleAddTask} />
        
        <FilterButtons currentFilter={filter} onFilterChange={setFilter} />
        
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            {tasks.length === 0 
              ? '✨ No tasks yet. Add your first task above!' 
              : `No {filter.toLowerCase()} tasks found.`}
          </div>
        ) : (
          <div>
            {filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;