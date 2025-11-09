
import { IGroup, ITodo } from "../types/types";

// Базовые типы для API ответов
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: number;
}

// Типы для конкретных endpoints
export interface GroupsResponse {
  groups: IGroup[];
}

export interface GroupResponse {
  group: IGroup;
}

export interface TodosResponse {
  todos: ITodo[];
}

export interface TodoResponse {
  todo: ITodo;
}

// сервер
const API_BASE_URL = 'http://localhost:3000/api';

// Общая функция для HTTP запросов
const fetchApi = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getGroupsRequest = async (): Promise<ApiResponse<GroupsResponse>> => {
  return fetchApi<ApiResponse<GroupsResponse>>('/groups');
};

export const createGroupRequest = async (groupData: Omit<IGroup, 'id' | 'createdAt'>): Promise<ApiResponse<GroupResponse>> => {
  return fetchApi<ApiResponse<GroupResponse>>('/groups', {
    method: 'POST',
    body: JSON.stringify(groupData),
  });
};

export const deleteGroupRequest = async (groupId: string): Promise<ApiResponse<{ success: boolean }>> => {
  return fetchApi<ApiResponse<{ success: boolean }>>(`/groups/${groupId}`, {
    method: 'DELETE',
  });
};

export const getTodayTodosRequest = async (): Promise<ApiResponse<TodosResponse>> => {
  return fetchApi<ApiResponse<TodosResponse>>('/todos/today');
};

export const getTodosRequest = async (groupId: string): Promise<ApiResponse<TodosResponse>> => {
  return fetchApi<ApiResponse<TodosResponse>>(`/todos/${groupId}`);
};

export const createTodoRequest = async (todoData: Omit<ITodo, 'id'>): Promise<ApiResponse<TodoResponse>> => {
  return fetchApi<ApiResponse<TodoResponse>>('/todos', {
    method: 'POST',
    body: JSON.stringify(todoData),
  });
};

export const deleteTodoRequest = async (todoId: string): Promise<ApiResponse<{ success: boolean }>> => {
  return fetchApi<ApiResponse<{ success: boolean }>>(`/todos/${todoId}`, {
    method: 'DELETE',
  });
};

export const toggleTodoRequest = async (todoId: string): Promise<ApiResponse<TodoResponse>> => {
  return fetchApi<ApiResponse<TodoResponse>>(`/todos/${todoId}/toggle`, {
    method: 'PATCH',
  });
};