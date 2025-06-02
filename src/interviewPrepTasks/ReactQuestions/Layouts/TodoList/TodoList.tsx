import { useState } from 'react';
import './TodoList.css';
import { v4 as uuid } from 'uuid';

interface ITask {
  id: string;
  text: string;
  completed: boolean;
}

const TodoList = () => {
  const [tasks, setTasks] = useState<ITask[]>([
    { id: '1', text: 'Buy groceries', completed: false },
    { id: '2', text: 'Walk the dog', completed: true },
    // Add more tasks as needed
  ]);
  const [taskText, setTaskText] = useState<string>('');

  const addTask = () => {
    const newTask: ITask = {
      id: uuid(),
      text: taskText,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setTaskText('');
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className='todo-list'>
      <div className='task-input'>
        <input
          value={taskText}
          onChange={(e) => {
            setTaskText(e.target.value);
          }}
          placeholder='Task desciption'
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task-item ${task.completed ? 'completed' : ''}`}
          >
            <span onClick={() => toggleTaskCompletion(task.id)}>
              {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
