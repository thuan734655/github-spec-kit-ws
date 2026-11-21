import type { TaskSnapshot } from './types';

export function addTask(snapshot: TaskSnapshot, input: string): TaskSnapshot | null {
  const title = input.trim();
  if (!title) {
    return null;
  }
  if (snapshot.nextId >= Number.MAX_SAFE_INTEGER) {
    throw new Error('Task IDs exhausted');
  }
  return {
    ...snapshot,
    nextId: snapshot.nextId + 1,
    tasks: [{ id: snapshot.nextId, title, completed: false }, ...snapshot.tasks],
  };
}

export function toggleTask(snapshot: TaskSnapshot, id: number): TaskSnapshot | null {
  const index = snapshot.tasks.findIndex(task => task.id === id);
  if (index === -1) {
    return null;
  }
  const tasks = snapshot.tasks.slice();
  const task = tasks[index];
  tasks[index] = { ...task, completed: !task.completed };
  return { ...snapshot, tasks };
}

export function removeTask(snapshot: TaskSnapshot, id: number): TaskSnapshot | null {
  const tasks = snapshot.tasks.filter(task => task.id !== id);
  return tasks.length === snapshot.tasks.length ? null : { ...snapshot, tasks };
}
