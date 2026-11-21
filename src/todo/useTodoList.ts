import { useCallback, useEffect, useRef, useState } from 'react';
import { addTask, removeTask, toggleTask } from './taskList';
import type { ListState, TaskSnapshot, TaskStorage } from './types';

export function useTodoList(storage: TaskStorage) {
  const [state, setState] = useState<ListState>({ status: 'loading' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const committed = useRef<TaskSnapshot | null>(null);
  const writing = useRef(false);
  const generation = useRef(0);

  const load = useCallback(async () => {
    const request = ++generation.current;
    committed.current = null;
    setState({ status: 'loading' });
    try {
      const snapshot = await storage.load();
      if (request === generation.current) {
        committed.current = snapshot;
        setState({ status: 'ready', snapshot });
      }
    } catch {
      if (request === generation.current) {
        setState({ status: 'failed' });
      }
    }
  }, [storage]);

  useEffect(() => {
    void load();
    return () => { generation.current++; };
  }, [load]);

  async function change(update: (current: TaskSnapshot) => TaskSnapshot | null) {
    const current = committed.current;
    if (!current || writing.current) {
      return false;
    }
    const request = generation.current;
    writing.current = true;
    setSaving(true);
    setSaveError(false);
    try {
      const next = update(current);
      if (!next) {
        return false;
      }
      await storage.save(next);
      if (request !== generation.current) {
        return false;
      }
      committed.current = next;
      setState({ status: 'ready', snapshot: next });
      return true;
    } catch {
      if (request === generation.current) {
        setSaveError(true);
      }
      return false;
    } finally {
      writing.current = false;
      setSaving(false);
    }
  }

  return {
    state,
    saving,
    saveError,
    retry: load,
    add: (title: string) => change(snapshot => addTask(snapshot, title)),
    toggle: (id: number) => change(snapshot => toggleTask(snapshot, id)),
    remove: (id: number) => change(snapshot => removeTask(snapshot, id)),
  };
}
