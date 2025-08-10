import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

const LOCAL_STORAGE_KEY = 'taskify-list';

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function handleAddTask(event: FormEvent) {
    event.preventDefault();

    if (!newTaskDescription.trim()) {
      setErrorMessage('Please enter a task before adding!');
      return;
    }

    setErrorMessage('');

    const newTask: Task = {
      id: Date.now(),
      description: newTaskDescription.trim(),
      completed: false,
    };

    setTasks((oldTasks) => [...oldTasks, newTask]);
    setNewTaskDescription('');
  }

  function toggleTaskCompletion(taskId: number) {
    setTasks((oldTasks) =>
      oldTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function removeTask(taskId: number) {
    setTasks((oldTasks) => oldTasks.filter((task) => task.id !== taskId));
  }

  function clearCompletedTasks() {
    setTasks((oldTasks) => oldTasks.filter((task) => !task.completed));
  }

  const completedTasksCount = tasks.filter((task) => task.completed).length;

  const maxHeightForDesktop = 320;
  const maxHeightForMobile = 220;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-0">
      <div
        className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg shadow-black/50 flex flex-col overflow-x-hidden sm:p-6 p-4"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-black text-center select-none">
          Taskify - To Do List App
        </h1>

        <form
          onSubmit={handleAddTask}
          className="flex gap-3 mb-3 flex-col sm:flex-row"
          aria-label="Add new task"
        >
          <input
            type="text"
            placeholder="New task..."
            className="flex-grow border border-gray-300 rounded px-4 py-3 text-base sm:text-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            aria-label="New task description"
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded font-semibold w-full sm:w-auto mt-2 sm:mt-0 hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </form>

        {errorMessage && (
          <p className="text-red-600 mb-4 font-semibold text-center" role="alert">
            {errorMessage}
          </p>
        )}

        {tasks.length > 0 && (
          <div className="flex justify-between mb-4 text-black text-sm select-none flex-wrap gap-2">
            <span>Total: {tasks.length}</span>
            <span>Completed: {completedTasksCount}</span>
            {completedTasksCount > 0 && (
              <button
                onClick={clearCompletedTasks}
                className="text-blue-600 font-semibold underline hover:text-blue-800"
                aria-label="Clear completed tasks"
              >
                Clear Completed
              </button>
            )}
          </div>
        )}

        <ul
          className="space-y-3 overflow-y-auto"
          style={{
            maxHeight:
              window.innerWidth < 640 ? maxHeightForMobile : maxHeightForDesktop,
          }}
          aria-live="polite"
          aria-relevant="additions removals"
        >
          {tasks.map(({ id, description, completed }) => (
            <li
              key={id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded shadow"
            >
              <label
                className="flex items-center gap-3 cursor-pointer select-none text-black flex-grow"
                htmlFor={`task-${id}`}
              >
                <input
                  id={`task-${id}`}
                  type="checkbox"
                  checked={completed}
                  onChange={() => toggleTaskCompletion(id)}
                  className="w-6 h-6 rounded cursor-pointer flex-shrink-0"
                  aria-checked={completed}
                />
                <span
                  className={`text-base sm:text-lg ${
                    completed ? 'line-through text-gray-500' : ''
                  } break-words`}
                >
                  {description}
                </span>
              </label>

              <button
                onClick={() => removeTask(id)}
                className="text-blue-600 font-bold text-2xl leading-none flex-shrink-0 ml-3 hover:text-red-600"
                aria-label={`Remove task: ${description}`}
                title="Remove task"
              >
                ×
              </button>
            </li>
          ))}

          {tasks.length === 0 && (
            <p className="text-gray-500 text-center select-none">No tasks yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
