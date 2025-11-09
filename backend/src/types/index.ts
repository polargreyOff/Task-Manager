export interface IUser {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface IGroup {
  id: string;
  user_id: string;
  title: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface ITodo {
  id: string;
  user_id: string;       
  group_id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'mid' | 'high';
  date: string;           // Оставляем string для фронта, в БД будет DATE
  color: string;
  created_at: string;
  updated_at: string;
}


export interface ITodoWithGroup extends ITodo {
  group_color: string;    // Для твоего groupColor на фронте
}

// Для создания новых записей
export type CreateGroupRequest = Omit<IGroup, 'id' | 'created_at' | 'updated_at'>;
export type CreateTodoRequest = Omit<ITodo, 'id' | 'created_at' | 'updated_at'>;
export type CreateUserRequest = Omit<IUser, 'id' | 'created_at' | 'updated_at'>;