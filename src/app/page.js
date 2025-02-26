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


  const handleDeleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
     <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Todo App</h1>

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
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add Todo
        </button>
      </form>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li key={todo.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleCompletion(todo.id, todo.completed)}
                  className="h-5 w-5"
                />
                <span
                  className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}
                >
                  {todo.title}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
