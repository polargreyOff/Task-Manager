
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
// Фейковые данные
const mockGroups: IGroup[] = [
  {
    id: '1',
    title: 'Работа',
    color: '#ff6b6b',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2', 
    title: 'Личное',
    color: '#4ecdc4',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Спорт',
    color: '#45b7d1', 
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Работа',
    color: '#25e517',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5', 
    title: 'Личное',
    color: '#dd1ade',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Спорт',
    color: '#fbba5b', 
    createdAt: new Date().toISOString(),
  }
];

const mockTodos: ITodo[] = [
  {
    id: '1',
    groupId: '1',
    title: 'Завершить проект',
    description: 'Доделать все задачи по проекту',
    completed: false,
    priority: 'high',
    date: new Date().toISOString(),
    color: '#dd1ade',
    groupColor: '#ff6b6b'
  },
  {
    id: '2',
    groupId: '1', 
    title: 'Созвон с командой',
    description: 'Еженедельный созвон в 15:00',
    completed: true,
    priority: 'mid',
    date: new Date().toISOString(),
    color: '#fbba5b', 
    groupColor: '#ff6b6b'
  },
  {
    id: '3',
    groupId: '2',
    title: 'Завершить проект',
    description: 'Доделать все задачи по проекту',
    completed: false,
    priority: 'high',
    date: new Date().toISOString(),
    color: '#25e517',
    groupColor: '#4ecdc4'
  },
  {
    id: '4',
    groupId: '2', 
    title: 'Созвон с командой',
    description: 'Еженедельный созвон в 15:00',
    completed: true,
    priority: 'mid',
    date: new Date().toISOString(),
    color: '#45b7d1',
    groupColor: '#4ecdc4'
  }
];

// Groups API
export const getGroupsRequest = async (): Promise<ApiResponse<GroupsResponse>> => {
  return await new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          groups: mockGroups
        }
      });
    }, 1500)
  );
};

export const getGroupRequest = async (groupId: string): Promise<ApiResponse<GroupResponse>> => {
  return await new Promise((resolve, reject) =>
    setTimeout(() => {
      const group = mockGroups.find(g => g.id === groupId);
      if (group) {
        resolve({
          success: true,
          data: { group }
        });
      } else {
        reject({
          success: false,
          error: 'Group not found'
        });
      }
    }, 1000)
  );
};

export const getTodosRequest = async (id: string): Promise<ApiResponse<TodosResponse>> => {
  return await new Promise((resolve) =>
    setTimeout(() => {
      const groupTodos = mockTodos.filter(todo => todo.groupId === id);
      resolve({
        success: true,
        data: {
          todos: groupTodos
        }
      });
    }, 1200)
  );
};

export const getTodayTodosRequest = async (): Promise<ApiResponse<TodosResponse>> => {
  return await new Promise((resolve) =>
    setTimeout(() => {
      const today = new Date().toDateString();
      const todayTodos = mockTodos.filter(todo => {
        const todoDate = new Date(todo.date).toDateString();
        return todoDate === today;
      });
      console.log(todayTodos);
      resolve({
        success: true,
        data: {
          todos: todayTodos
        }
      });
    }, 1200)
  );
};

export const createTodoRequest = async (todoData: Omit<ITodo, 'id'>): Promise<ApiResponse<TodoResponse>> => {
  return await new Promise((resolve) =>
    setTimeout(() => {
      const newTodo: ITodo = {
        ...todoData,
        id: `todo-${Date.now()}`,
      };
      mockTodos.push(newTodo);
      
      resolve({
        success: true,
        data: { todo: newTodo },
        message: 'Todo created successfully'
      });
    }, 800)
  );
};

// export const createGroupRequest = async (groupData: Omit<IGroup, 'id' | 'createdAt'>): Promise<ApiResponse<GroupResponse>> => {
//   return await new Promise((resolve) =>
//     setTimeout(() => {
//       const newGroup: IGroup = {
//         ...groupData,
//         id: `group-${Date.now()}`,
//         createdAt: new Date().toISOString(),
//       };
//       mockGroups.push(newGroup);
      
//       resolve({
//         success: true,
//         data: { group: newGroup },
//         message: 'Group created successfully'
//       });
//     }, 1000)
//   );
// };

// Todos API  

// export const updateTodoRequest = async (todoId: string, updates: Partial<Todo>): Promise<ApiResponse<TodoResponse>> => {
//   return await new Promise((resolve, reject) =>
//     setTimeout(() => {
//       const todoIndex = mockTodos.findIndex(t => t.id === todoId);
//       if (todoIndex !== -1) {
//         const updatedTodo: Todo = {
//           ...mockTodos[todoIndex],
//           ...updates,
//           updatedAt: new Date().toISOString(),
//         };
//         mockTodos[todoIndex] = updatedTodo;
        
//         resolve({
//           success: true,
//           data: { todo: updatedTodo },
//           message: 'Todo updated successfully'
//         });
//       } else {
//         reject({
//           success: false,
//           error: 'Todo not found'
//         });
//       }
//     }, 800)
//   );
// };

// export const toggleTodoRequest = async (todoId: string): Promise<ApiResponse<TodoResponse>> => {
//   return await new Promise((resolve, reject) =>
//     setTimeout(() => {
//       const todoIndex = mockTodos.findIndex(t => t.id === todoId);
//       if (todoIndex !== -1) {
//         const updatedTodo: Todo = {
//           ...mockTodos[todoIndex],
//           completed: !mockTodos[todoIndex].completed,
//           updatedAt: new Date().toISOString(),
//         };
//         mockTodos[todoIndex] = updatedTodo;
        
//         resolve({
//           success: true,
//           data: { todo: updatedTodo },
//           message: 'Todo toggled successfully'
//         });
//       } else {
//         reject({
//           success: false, 
//           error: 'Todo not found'
//         });
//       }
//     }, 500)
//   );
// };