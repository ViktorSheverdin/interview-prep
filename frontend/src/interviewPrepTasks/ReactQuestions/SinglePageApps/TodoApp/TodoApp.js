import { useState } from 'react';

const defaultTasks = [
  { id: 0, task: 'Task 1' },
  { id: 1, task: 'Task 2' },
  { id: 2, task: 'Task 3' },
];

export const TodoApp = () => {
  const [tasks, setTasks] = useState(defaultTasks);
  const [value, setValue] = useState('');

  const addTask = () => {
    const newTask = {
      id: tasks[tasks.length - 1].id + 1,
      task: value,
    };
    setTasks((prev) => [...prev, newTask]);
    setValue('');
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };
  return (
    <div>
      <div>Todo App</div>
      <div>
        <input
          value={value}
          placeholder='Task...'
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {tasks.map((task) => {
        return (
          <div
            key={task.id}
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            <div>{task.task}</div>
            <button
              onClick={() => {
                removeTask(task.id);
              }}
            >
              -
            </button>
          </div>
        );
      })}
    </div>
  );
};
