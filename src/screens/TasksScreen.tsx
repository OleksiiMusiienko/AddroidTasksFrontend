import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from '../api/tasksApi.ts';

import { Task } from '../types/Task.ts';
import TaskItem from '../components/TaskItem.tsx';
import { useAuth } from '../context/AuthContext.tsx';

const TasksScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const { accessToken, logout } = useAuth();

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getAllTasks(accessToken);

      setTasks(data);
    } catch (error) {
      const message =
          error instanceof Error
              ? error.message
              : String(error);

      Alert.alert(
          'Помилка завантаження',
          message
      );

      console.log(
          'LOAD TASKS ERROR:',
          error
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      loadTasks();
    }
  }, [accessToken, loadTasks]);

  const handleAddTask = async () => {
    if (!title.trim()) {
      Alert.alert(
          'Помилка',
          'Введіть назву справи'
      );

      return;
    }

    try {
      const task = await createTask(
          accessToken,
          title,
          description
      );

      setTasks(prev => [
        task,
        ...prev,
      ]);

      setTitle('');
      setDescription('');
    } catch (error) {
      const message =
          error instanceof Error
              ? error.message
              : String(error);

      Alert.alert(
          'Помилка створення',
          message
      );

      console.log(
          'CREATE TASK ERROR:',
          error
      );
    }
  };

  const handleToggle = async (
      task: Task
  ) => {
    const updatedTask: Task = {
      ...task,
      completed: !task.completed,
    };

    try {
      const result = await updateTask(
          accessToken,
          updatedTask
      );

      setTasks(prev =>
          prev.map(item =>
              item.id === result.id
                  ? result
                  : item
          )
      );
    } catch (error) {
      const message =
          error instanceof Error
              ? error.message
              : String(error);

      Alert.alert(
          'Помилка оновлення',
          message
      );

      console.log(
          'UPDATE TASK ERROR:',
          error
      );
    }
  };

  const handleDelete = (
      task: Task
  ) => {
    Alert.alert(
        'Видалення',
        `Видалити справу "${task.title}"?`,
        [
          {
            text: 'Скасувати',
            style: 'cancel',
          },
          {
            text: 'Видалити',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteTask(
                    accessToken,
                    task.id
                );

                setTasks(prev =>
                    prev.filter(
                        item => item.id !== task.id
                    )
                );
              } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : String(error);

                Alert.alert(
                    'Помилка видалення',
                    message
                );

                console.log(
                    'DELETE TASK ERROR:',
                    error
                );
              }
            },
          },
        ]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      const message =
          error instanceof Error
              ? error.message
              : String(error);

      Alert.alert(
          'Помилка виходу',
          message
      );
    }
  };

  if (loading) {
    return (
        <View style={styles.center}>
          <ActivityIndicator
              size="large"
              color="#2563EB"
          />

          <Text style={styles.loadingText}>
            Завантаження справ...
          </Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>

        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.header}>
              Мої справи
            </Text>

            <Text style={styles.subHeader}>
              Заплануйте справи на сьогодні
            </Text>
          </View>

          <Pressable
              style={styles.logoutButton}
              onPress={handleLogout}
          >
            <Text style={styles.logoutText}>
              Вийти
            </Text>
          </Pressable>
        </View>

        <View style={styles.addCard}>
          <Text style={styles.addTitle}>
            Нова справа
          </Text>

          <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Назва справи"
              placeholderTextColor="#9CA3AF"
          />

          <TextInput
              style={[
                styles.input,
                styles.descriptionInput,
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Опис справи"
              placeholderTextColor="#9CA3AF"
              multiline
          />

        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Список справ
          </Text>

          <Text style={styles.taskCount}>
            {tasks.length}
          </Text>
        </View>

        <FlatList
            data={tasks}
            keyExtractor={item =>
                item.id.toString()
            }
            renderItem={({ item }) => (
                <TaskItem
                    task={item}
                    onToggle={() =>
                        handleToggle(item)
                    }
                    onDelete={() =>
                        handleDelete(item)
                    }
                />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              tasks.length === 0
                  ? styles.emptyList
                  : styles.listContent
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>
                  ✓
                </Text>

                <Text style={styles.emptyTitle}>
                  Справ поки немає
                </Text>

                <Text style={styles.emptyText}>
                  Додайте свою першу справу
                </Text>
              </View>
            }
        />


        {/* FLOATING SAVE BUTTON */}

        <Pressable
            style={styles.fab}
            onPress={handleAddTask}
        >
          <Text style={styles.fabText}>
            💾
          </Text>
        </Pressable>

      </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingTop: 45,
    paddingHorizontal: 18,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
  },


  // HEADER

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },

  subHeader: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
  },

  logoutButton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },


  // ADD CARD

  addCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,

    elevation: 2,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  addTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },

  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 15,
    color: '#111827',
    marginBottom: 12,
  },

  descriptionInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },

  addHint: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'right',
  },


  // LIST

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  listTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
  },

  taskCount: {
    marginLeft: 8,
    backgroundColor: '#DBEAFE',
    color: '#2563EB',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 13,
    fontWeight: '700',
  },

  listContent: {
    paddingBottom: 110,
  },


  // EMPTY LIST

  emptyList: {
    flexGrow: 1,
    paddingBottom: 110,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 50,
  },

  emptyIcon: {
    width: 52,
    height: 52,
    lineHeight: 52,
    textAlign: 'center',
    borderRadius: 26,
    backgroundColor: '#DBEAFE',
    color: '#2563EB',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#374151',
  },

  emptyText: {
    marginTop: 5,
    fontSize: 14,
    color: '#9CA3AF',
  },


  // FLOATING BUTTON

  fab: {
    position: 'absolute',
    right: 22,
    bottom: 28,

    width: 62,
    height: 62,
    borderRadius: 31,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#2563EB',

    elevation: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,

    zIndex: 10,
  },

  fabText: {
    fontSize: 27,
  },
});

export default TasksScreen;