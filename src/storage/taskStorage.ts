import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task, TaskSnapshot, TaskStorage } from '../todo/types';

const storageKey = '@mini-todo-list/tasks';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

function isTask(value: unknown): value is Task {
  return isRecord(value) && isPositiveInteger(value.id) &&
    typeof value.title === 'string' && value.title.length > 0 &&
    value.title.trim() === value.title && typeof value.completed === 'boolean';
}

function isSnapshot(value: unknown): value is TaskSnapshot {
  if (!isRecord(value) || value.version !== 1 ||
      !isPositiveInteger(value.nextId) || !Array.isArray(value.tasks)) {
    return false;
  }
  let upperBound = value.nextId;
  for (const task of value.tasks as unknown[]) {
    if (!isTask(task) || task.id >= upperBound) {
      return false;
    }
    upperBound = task.id;
  }
  return true;
}

export const taskStorage: TaskStorage = {
  async load() {
    const raw = await AsyncStorage.getItem(storageKey);
    if (raw === null) {
      return { version: 1, nextId: 1, tasks: [] };
    }
    const snapshot: unknown = JSON.parse(raw);
    if (!isSnapshot(snapshot)) {
      throw new Error('Invalid task snapshot');
    }
    return snapshot;
  },
  async save(snapshot) {
    if (!isSnapshot(snapshot)) {
      throw new Error('Invalid task snapshot');
    }
    await AsyncStorage.setItem(storageKey, JSON.stringify(snapshot));
  },
};
