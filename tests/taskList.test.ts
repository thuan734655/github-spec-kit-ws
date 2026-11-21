import { addTask, removeTask, toggleTask } from '../src/todo/taskList';
import type { TaskSnapshot } from '../src/todo/types';

const empty: TaskSnapshot = { version: 1, nextId: 1, tasks: [] };
const one = () => addTask(empty, '  Read  ')!;
const two = () => addTask(one(), 'Read')!;

it.each(['', ' ', '\t\n'])('rejects blank title %p', title => {
  expect(addTask(empty, title)).toBeNull();
  expect(empty.tasks).toEqual([]);
});

it('trims titles, prepends incomplete tasks, and gives duplicates distinct IDs', () => {
  expect(two().tasks).toEqual([
    { id: 2, title: 'Read', completed: false },
    { id: 1, title: 'Read', completed: false },
  ]);
});

it('does not advance the ID beyond safe integers', () => {
  expect(() => addTask({ ...empty, nextId: Number.MAX_SAFE_INTEGER }, 'Read')).toThrow();
});

it('toggles the selected task in both directions without reordering duplicates', () => {
  const original = two();
  const completed = toggleTask(original, 1)!;
  expect(completed.tasks.map(task => [task.id, task.completed])).toEqual([[2, false], [1, true]]);
  expect(toggleTask(completed, 1)).toEqual(original);
});

it('deletes only the selected ID, preserves survivor order and keeps the counter', () => {
  const list = addTask(two(), 'Write')!;
  expect(removeTask(list, 2)?.tasks.map(task => task.id)).toEqual([3, 1]);
  expect(removeTask(one(), 1)).toEqual({ version: 1, nextId: 2, tasks: [] });
  expect(removeTask(one(), 99)).toBeNull();
});
