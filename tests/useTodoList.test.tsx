import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert, Keyboard } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TodoScreen } from '../src/components/TodoScreen';
import type { TaskSnapshot } from '../src/todo/types';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const metrics = {
  frame: { x: 0, y: 0, width: 375, height: 812 },
  insets: { top: 44, right: 0, bottom: 34, left: 0 },
};
const empty: TaskSnapshot = { version: 1, nextId: 1, tasks: [] };
const mixed: TaskSnapshot = {
  version: 1,
  nextId: 3,
  tasks: [
    { id: 2, title: 'Read', completed: false },
    { id: 1, title: 'Read', completed: true },
  ],
};

function setup(initial = empty) {
  let saved = initial;
  const storage = {
    load: jest.fn(async () => saved),
    save: jest.fn(async (snapshot: TaskSnapshot) => { saved = snapshot; }),
  };
  const open = () => render(
    <SafeAreaProvider initialMetrics={metrics}>
      <TodoScreen storage={storage} />
    </SafeAreaProvider>,
  );
  return { open, storage, readSaved: () => saved };
}

async function add(title: string) {
  await fireEvent.changeText(screen.getByLabelText('Task title'), title);
  await fireEvent.press(screen.getByRole('button', { name: 'Add' }));
}

afterEach(() => jest.restoreAllMocks());

it('shows empty state, rejects whitespace and adds trimmed tasks in newest-first order', async () => {
  const { open, storage, readSaved } = setup();
  await open();
  await screen.findByText('No tasks yet');
  await add('');
  expect(screen.getByText('Enter a task title.')).toBeTruthy();
  await add('  \t ');
  expect(storage.save).not.toHaveBeenCalled();
  await add('  Read  ');
  await screen.findByRole('checkbox', { name: 'Read' });
  expect(screen.getByLabelText('Task title').props.value).toBe('');
  await add('Write');
  await screen.findByRole('checkbox', { name: 'Write' });
  expect(readSaved().tasks.map(task => task.title)).toEqual(['Write', 'Read']);
  expect(screen.getAllByRole('checkbox').map(row => row.props.accessibilityLabel)).toEqual(['Write', 'Read']);
});

it('blocks changes until Retry restores the list after repeated read errors', async () => {
  const { open, storage } = setup(mixed);
  let failLoad!: (reason: Error) => void;
  storage.load.mockImplementationOnce(() => new Promise((_, reject) => { failLoad = reject; }));
  storage.load.mockRejectedValueOnce(new Error());
  await open();
  expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
  await act(async () => failLoad(new Error()));
  await screen.findByText('Could not load tasks.');
  expect(screen.queryByText('No tasks yet')).toBeNull();
  await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
  await screen.findByText('Could not load tasks.');
  expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
  await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
  await waitFor(() => expect(screen.getAllByRole('checkbox')).toHaveLength(2));
  expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled();
  expect(storage.save).not.toHaveBeenCalled();
});

it('retains the draft after failed add and guards against overlapping saves', async () => {
  const { open, storage } = setup();
  storage.save.mockRejectedValueOnce(new Error());
  await open();
  await screen.findByText('No tasks yet');
  await add('Read');
  await screen.findByText('Could not save changes. Please try again.');
  expect(screen.getByLabelText('Task title').props.value).toBe('Read');
  let finish!: () => void;
  storage.save.mockImplementationOnce(() => new Promise<void>(resolve => { finish = resolve; }));
  await fireEvent.press(screen.getByRole('button', { name: 'Add' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Add' }));
  expect(storage.save).toHaveBeenCalledTimes(2);
  expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
  expect(screen.getByLabelText('Task title')).toBeDisabled();
  await act(async () => finish());
  expect(screen.getByRole('checkbox', { name: 'Read' })).toBeTruthy();
});

it('toggles and reopens in place, preserves state after a failed save and restores on remount', async () => {
  const { open, storage } = setup(mixed);
  const view = await open();
  await screen.findAllByRole('checkbox');
  const states = () => screen.getAllByRole('checkbox').map(row => row.props.accessibilityState.checked);
  expect(states()).toEqual([false, true]);
  storage.save.mockRejectedValueOnce(new Error());
  await fireEvent.press(screen.getAllByRole('checkbox')[0]);
  await screen.findByText('Could not save changes. Please try again.');
  expect(states()).toEqual([false, true]);
  await fireEvent.press(screen.getAllByRole('checkbox')[0]);
  await waitFor(() => expect(states()).toEqual([true, true]));
  await fireEvent.press(screen.getAllByRole('checkbox')[1]);
  await waitFor(() => expect(states()).toEqual([true, false]));
  await view.unmount();
  await open();
  await screen.findAllByRole('checkbox');
  expect(states()).toEqual([true, false]);
});

it('honors cancel, shows delete write failure, and persists only confirmed deletion', async () => {
  const { open, storage, readSaved } = setup(mixed);
  const confirm = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  const view = await open();
  await screen.findAllByRole('checkbox');
  const request = () => fireEvent.press(screen.getAllByRole('button', { name: 'Delete Read' })[0]);
  const choose = (index: number) => act(() => confirm.mock.lastCall?.[2]?.[index]?.onPress?.());
  await request();
  expect(confirm.mock.lastCall?.[2]?.[0]?.style).toBe('cancel');
  await choose(0);
  expect(storage.save).not.toHaveBeenCalled();
  storage.save.mockRejectedValueOnce(new Error());
  await request();
  await choose(1);
  await screen.findByText('Could not save changes. Please try again.');
  expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  await request();
  await choose(1);
  await waitFor(() => expect(screen.getAllByRole('checkbox')).toHaveLength(1));
  expect(readSaved().tasks.map(task => task.id)).toEqual([1]);
  await view.unmount();
  await open();
  await screen.findByRole('checkbox');
  await request();
  await choose(1);
  await screen.findByText('No tasks yet');
});

it('offers a labeled keyboard dismissal action on the task screen', async () => {
  const dismiss = jest.spyOn(Keyboard, 'dismiss').mockImplementation(() => {});
  await setup().open();
  await screen.findByText('No tasks yet');
  await fireEvent.press(screen.getByRole('button', { name: 'Dismiss keyboard' }));
  expect(dismiss).toHaveBeenCalledTimes(1);
});
