import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Task } from '../todo/types';

interface Props {
  task: Task;
  disabled: boolean;
  onToggle: (id: number) => void;
  onDelete: (task: Task) => void;
}

export function TaskRow({ task, disabled, onToggle, onDelete }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={task.title}
        accessibilityState={{ checked: task.completed, disabled }}
        disabled={disabled}
        onPress={() => onToggle(task.id)}
        style={styles.task}
      >
        <View style={[styles.circle, task.completed && styles.checked]}>
          {task.completed && <Text style={styles.tick}>✓</Text>}
        </View>
        <Text style={[styles.title, task.completed && styles.completed]}>{task.title}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Delete ${task.title}`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => onDelete(task)}
        style={styles.remove}
      >
        <Text style={styles.removeLabel}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  task: { flex: 1, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 12 },
  circle: {
    width: 22, height: 22, borderWidth: 2, borderRadius: 11,
    borderColor: '#4E7164', alignItems: 'center', justifyContent: 'center',
  },
  checked: { backgroundColor: '#285C48', borderColor: '#285C48' },
  tick: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  title: { flex: 1, fontSize: 16, color: '#1D332B', paddingVertical: 8 },
  completed: { textDecorationLine: 'line-through', color: '#4C6259' },
  remove: { minHeight: 44, minWidth: 44, justifyContent: 'center', paddingHorizontal: 6 },
  removeLabel: { color: '#A23338', fontSize: 14, fontWeight: '600' },
});
