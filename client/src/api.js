const TOKEN_KEY = 'token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function errorText(err, fallback) {
  return err instanceof ApiError ? err.message : fallback;
}

async function request(method, path, body) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, data?.error ?? `Request failed (${response.status})`);
  }
  return data;
}

export async function login(email, password) {
  const { token } = await request('POST', '/auth/login', { email, password });
  localStorage.setItem(TOKEN_KEY, token);
}

export const listWorkouts = () => request('GET', '/workouts');
export const createWorkout = (workout) => request('POST', '/workouts', workout);
export const updateWorkout = (id, workout) => request('PUT', `/workouts/${id}`, workout);
export const deleteWorkout = (id) => request('DELETE', `/workouts/${id}`);