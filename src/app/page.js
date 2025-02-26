"use client";

import { useState, useEffect } from 'react';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTodos() {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
      setLoading(false);
    }
    fetchTodos();
  }, []);


  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const newTodo = {
      title: newTask,
      completed: false,
      priority: 'Normal', 
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    });

    const data = await response.json();
    setTodos((prevTodos) => [data, ...prevTodos]);
    setNewTask('');
  };

  // Toggle completion status of a todo
  const handleToggleCompletion = async (id, completed) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });

    const updatedTodo = await response.json();
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
    );
  };

  // Delete a todo
  const handleDeleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="w-full bg-[#E8E8E8] flex justify-center place-items-center p-8">
      <div className="max-w-[70rem] bg-white w-full p-8">
      
        <form onSubmit={handleAddTodo} className="mb-4 flex justify-center gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-1/3"
            placeholder="New task"
          />
          <button
            type="submit"
            className="bg-[#3756F9] text-white text-base font-medium px-4 py-2 rounded-lg"
          >
            Add New Task
          </button>
        </form>

        <div className="mb-4 font-semibold text-xl">All Tasks</div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Task</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Priority</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id} className="bg-gray-100 hover:bg-gray-200">
                  <td className="border px-4 py-2">
                    <span
                      className={`${
                        todo.completed ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {todo.title}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleCompletion(todo.id, todo.completed)}
                      className="h-5 w-5"
                    />
                  </td>
                  <td className="border px-4 py-2">{todo.priority || 'Normal'}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
