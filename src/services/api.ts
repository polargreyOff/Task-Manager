import { authService } from "./auth";
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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      username: string;
    };
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
  error?: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
  error?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  created_at: string;
  last_login?: string;
}

export interface ProfileResponse {
  success: boolean;
  data: {
    user: UserProfile;
  };
  error?: string;
} 

// сервер
const API_BASE_URL = 'http://localhost:3010/api';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Функция для подписки на обновление токена
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Функция для уведомления подписчиков о новом токене
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Функция для обновления токена
const refreshAuthToken = async (): Promise<string | null> => {
  if (isRefreshing) {
    // Если уже обновляем, ждем
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(token);
      });
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = authService.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    
    if (data.success) {
      authService.setTokens(data.data.accessToken, data.data.refreshToken);
      onRefreshed(data.data.accessToken);
      return data.data.accessToken;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    // Если refresh не удался - разлогиниваем
    authService.clearTokens();
    window.location.href = '/login';
    return null;
  } finally {
    isRefreshing = false;
  }
};

// Основная функция для API запросов
export const fetchApi = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  let token = authService.getAccessToken();
  
  const requestOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  let response = await fetch(`${API_BASE_URL}${url}`, requestOptions);

  if (response.status === 403 && token) {
    const newToken = await refreshAuthToken();
    
    if (newToken) {
      requestOptions.headers = {
        ...requestOptions.headers,
        'Authorization': `Bearer ${newToken}`,
      };
      response = await fetch(`${API_BASE_URL}${url}`, requestOptions);
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      authService.clearTokens();
      window.location.href = '/login';
    }
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

// Функция для логина
export const loginRequest = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Функция для регистрации
export const registerRequest = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Функция для обновления токена
export const refreshTokenRequest = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Функция для выхода (опционально)
export const logoutRequest = async (): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authService.getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getProfileRequest = async (): Promise<ProfileResponse> => {
  return fetchApi<ProfileResponse>('/auth/profile');
};