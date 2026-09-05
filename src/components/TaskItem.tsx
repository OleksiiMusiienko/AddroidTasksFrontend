import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Task } from '../types/Task.ts';

interface Props {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

const TaskItem = ({ task, onToggle, onDelete }: Props) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.task} onPress={onToggle}>
        <View
          style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
        >
          <Text style={styles.checkText}>{task.completed ? '✓' : ''}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, task.completed && styles.completed]}>
            {task.title}
          </Text>

          {task.description ? (
            <Text
              style={[styles.description, task.completed && styles.completed]}
            >
              {task.description}
            </Text>
          ) : null}
        </View>
      </Pressable>

      <Pressable style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },

  task: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#555',
    borderRadius: 5,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxCompleted: {
    backgroundColor: '#333',
  },

  checkText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: '500',
  },

  description: {
    fontSize: 14,
    marginTop: 3,
    color: '#666',
  },

  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  deleteButton: {
    padding: 10,
  },

  deleteButtonText: {
    fontSize: 20,
  },
});

export default TaskItem;
