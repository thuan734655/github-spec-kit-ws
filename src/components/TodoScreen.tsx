import { useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Keyboard, KeyboardAvoidingView,
  Pressable, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { taskStorage } from '../storage/taskStorage';
import type { Task, TaskStorage } from '../todo/types';
import { useTodoList } from '../todo/useTodoList';
import { TaskRow } from './TaskRow';

export function TodoScreen({ storage = taskStorage }: { storage?: TaskStorage }) {
  const list = useTodoList(storage);
  const [title, setTitle] = useState('');
  const [invalid, setInvalid] = useState(false);
  const confirming = useRef(false);
  const disabled = list.state.status !== 'ready' || list.saving;

  async function submit() {
    if (disabled) {
      return;
    }
    if (!title.trim()) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    if (await list.add(title)) {
      setTitle('');
      Keyboard.dismiss();
    }
  }

  function confirmDelete(task: Task) {
    if (disabled || confirming.current) {
      return;
    }
    confirming.current = true;
    Alert.alert('Delete task?', task.title, [
      { text: 'Cancel', style: 'cancel', onPress: () => { confirming.current = false; } },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          confirming.current = false;
          void list.remove(task.id);
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.content} behavior="padding">
        <Text accessibilityRole="header" style={styles.heading}>Mini Todo List</Text>
        <View style={styles.form}>
          <TextInput
            accessibilityLabel="Task title"
            accessibilityState={{ disabled }}
            editable={!disabled}
            value={title}
            onChangeText={value => {
              setTitle(value);
              if (invalid) {
                setInvalid(false);
              }
            }}
            onSubmitEditing={() => { void submit(); }}
            returnKeyType="done"
            placeholder="Enter a task"
            placeholderTextColor="#52665C"
            style={styles.input}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={() => { void submit(); }}
            style={[styles.button, disabled && styles.disabled]}
          >
            <Text style={styles.buttonLabel}>Add</Text>
          </Pressable>
        </View>
        {invalid && <Text accessibilityRole="alert" style={styles.error}>Enter a task title.</Text>}
        {list.saveError && (
          <Text accessibilityRole="alert" style={styles.error}>Could not save changes. Please try again.</Text>
        )}
        {list.state.status === 'loading' && (
          <View style={styles.message}>
            <ActivityIndicator color="#285C48" />
            <Text style={styles.detail}>Loading tasks…</Text>
          </View>
        )}
        {list.state.status === 'failed' && (
          <View style={styles.message}>
            <Text accessibilityRole="alert" style={styles.error}>Could not load tasks.</Text>
            <Pressable accessibilityRole="button" onPress={() => { void list.retry(); }} style={styles.button}>
              <Text style={styles.buttonLabel}>Retry</Text>
            </Pressable>
          </View>
        )}
        {list.state.status === 'ready' && (
          <FlatList
            data={list.state.snapshot.tasks}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            keyExtractor={task => String(task.id)}
            renderItem={({ item }) => (
              <TaskRow task={item} disabled={disabled} onToggle={list.toggle} onDelete={confirmDelete} />
            )}
            ListEmptyComponent={
              <View style={styles.message}>
                <Text style={styles.emptyTitle}>No tasks yet</Text>
                <Text style={styles.detail}>Add your first task above.</Text>
              </View>
            }
          />
        )}
        <Pressable
          accessibilityRole="button"
          onPress={Keyboard.dismiss}
          style={styles.dismiss}
        >
          <Text style={styles.dismissLabel}>Dismiss keyboard</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F1F5F1' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 14 },
  heading: { color: '#1D332B', fontSize: 30, fontWeight: '700', marginBottom: 18 },
  form: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  input: {
    flex: 1, minHeight: 48, backgroundColor: '#FFFFFF', color: '#1D332B',
    borderWidth: 1, borderColor: '#849B91', borderRadius: 12, paddingHorizontal: 12, fontSize: 16,
  },
  button: {
    backgroundColor: '#285C48', borderRadius: 12, minHeight: 44, minWidth: 44,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16,
  },
  disabled: { backgroundColor: '#53665D' },
  buttonLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  message: { alignItems: 'center', gap: 10, paddingVertical: 24 },
  emptyTitle: { fontSize: 19, fontWeight: '600', color: '#1D332B' },
  detail: { fontSize: 16, color: '#52665C', textAlign: 'center' },
  error: { color: '#A23338', fontSize: 15, marginBottom: 8 },
  dismiss: { minHeight: 44, alignSelf: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  dismissLabel: { color: '#285C48', fontWeight: '600' },
});
