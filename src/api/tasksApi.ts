import { Task } from '../types/Task.ts';

const API_URL = 'http://10.0.2.2:8000/api';

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

const getErrorMessage = async (response: Response) => {
  const text = await response.text();

  if (text) {
    return `${response.status}: ${text}`;
  }

  return `HTTP error: ${response.status}`;
};

// =========================
// GET ALL TASKS
// =========================

export const getAllTasks = async (accessToken: string): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks/`, {
    method: 'GET',
    headers: {
      ...authHeaders(accessToken),
    },
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// =========================
// CREATE TASK
// =========================

export const createTask = async (
  accessToken: string,
  title: string,
  description: string,
): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(accessToken),
    },
    body: JSON.stringify({
      title,
      description,
      completed: false,
    }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// =========================
// UPDATE TASK
// =========================

export const updateTask = async (
  accessToken: string,
  task: Task,
): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${task.id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(accessToken),
    },
    body: JSON.stringify({
      title: task.title,
      description: task.description,
      completed: task.completed,
    }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// =========================
// DELETE TASK
// =========================

export const deleteTask = async (
  accessToken: string,
  id: number,
): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${id}/`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(accessToken),
    },
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
};

// =========================
// CHANGE COMPLETED
// =========================

export const completedTask = async (
  accessToken: string,
  id: number,
  completed: boolean,
): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(accessToken),
    },
    body: JSON.stringify({
      completed,
    }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// =========================
// LOGIN
// =========================

export const loginApi = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// =========================
// REGISTER
// =========================

export const register = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};
