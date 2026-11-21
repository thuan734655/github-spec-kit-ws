export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export interface TaskSnapshot {
  version: 1;
  nextId: number;
  tasks: Task[];
}

export interface TaskStorage {
  load(): Promise<TaskSnapshot>;
  save(snapshot: TaskSnapshot): Promise<void>;
}

export type ListState =
  | { status: 'loading' | 'failed' }
  | { status: 'ready'; snapshot: TaskSnapshot };
