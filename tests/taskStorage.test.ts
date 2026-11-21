import AsyncStorage from '@react-native-async-storage/async-storage';
import { taskStorage } from '../src/storage/taskStorage';
import type { TaskSnapshot } from '../src/todo/types';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const read = jest.mocked(AsyncStorage.getItem);
const write = jest.mocked(AsyncStorage.setItem);
const saved: TaskSnapshot = {
  version: 1,
  nextId: 4,
  tasks: [
    { id: 3, title: 'Read', completed: true },
    { id: 1, title: 'Read', completed: false },
  ],
};

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

it('returns an empty list for a missing key without writing', async () => {
  await expect(taskStorage.load()).resolves.toEqual({ version: 1, nextId: 1, tasks: [] });
  expect(write).not.toHaveBeenCalled();
});

it.each([saved, { ...saved, tasks: [] }])('round trips %p', async snapshot => {
  await taskStorage.save(snapshot);
  await expect(taskStorage.load()).resolves.toEqual(snapshot);
});

it.each([
  '{',
  JSON.stringify({ ...saved, version: 2 }),
  JSON.stringify({ ...saved, nextId: 3 }),
  JSON.stringify({ ...saved, tasks: [...saved.tasks].reverse() }),
  JSON.stringify({ ...saved, tasks: [saved.tasks[0], saved.tasks[0]] }),
  JSON.stringify({ ...saved, tasks: [{ ...saved.tasks[0], title: ' ' }] }),
  JSON.stringify({ ...saved, tasks: [{ ...saved.tasks[0], completed: 'yes' }] }),
])('rejects invalid data without replacing it: %s', async raw => {
  read.mockResolvedValueOnce(raw);
  await expect(taskStorage.load()).rejects.toThrow();
  expect(write).not.toHaveBeenCalled();
});

it('propagates native errors and keeps the previous snapshot on a rejected write', async () => {
  await taskStorage.save(saved);
  read.mockRejectedValueOnce(new Error('read failed'));
  await expect(taskStorage.load()).rejects.toThrow('read failed');
  write.mockRejectedValueOnce(new Error('write failed'));
  await expect(taskStorage.save({ ...saved, tasks: [] })).rejects.toThrow('write failed');
  await expect(taskStorage.load()).resolves.toEqual(saved);
});
