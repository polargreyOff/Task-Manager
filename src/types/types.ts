export enum ActionTypes {
    // Groups
    GROUPS_LOAD_REQUEST = 'GROUPS_LOAD_REQUEST',
    GROUPS_LOAD_SUCCESS = 'GROUPS_LOAD_SUCCESS',
    GROUPS_LOAD_FAILURE = 'GROUPS_LOAD_FAILURE',

    GROUP_CREATE_REQUEST = 'GROUP_CREATE_REQUEST',
    GROUP_CREATE_SUCCESS = 'GROUP_CREATE_SUCCESS',
    GROUP_CREATE_FAILURE = 'GROUP_CREATE_FAILURE',

    GROUP_DELETE_REQUEST = 'GROUP_DELETE_REQUEST',
    GROUP_DELETE_SUCCESS = 'GROUP_DELETE_SUCCESS',
    GROUP_DELETE_FAILURE = 'GROUP_DELETE_FAILURE',

    GROUP_SELECT = 'GROUP_SELECT',

    // Todos
    TODOS_LOAD_REQUEST = 'TODOS_LOAD_REQUEST',
    TODOS_LOAD_SUCCESS = 'TODOS_LOAD_SUCCESS',
    TODOS_LOAD_FAILURE = 'TODOS_LOAD_FAILURE',

    TODO_CREATE_REQUEST = 'TODO_CREATE_REQUEST',
    TODO_CREATE_SUCCESS = 'TODO_CREATE_SUCCESS',
    TODO_CREATE_FAILURE = 'TODO_CREATE_FAILURE',

    TODO_DELETE_REQUEST = 'TODO_DELETE_REQUEST',
    TODO_DELETE_SUCCESS = 'TODO_DELETE_SUCCESS',
    TODO_DELETE_FAILURE = 'TODO_DELETE_FAILURE',
    TODO_TOGGLE = 'TODO_TOGGLE',

    // today todos
    TODAY_TODOS_REQUEST = "TODAY_TODOS_REQUEST",
    TODAY_TODOS_SUCCESS = "TODAY_TODOS_SUCCESS",
    TODAY_TODOS_FAILURE = "TODAY_TODOS_FAILURE",

    // UI
    FILTERS_SET = 'FILTERS_SET',
    FILTERS_RESET = 'FILTERS_RESET',
    MODAL_OPEN = 'MODAL_OPEN',
    MODAL_CLOSE = 'MODAL_CLOSE',
    TODAY_TODOS_UPDATE = 'TODAY_TODOS_UPDATE',
}

export interface ITodo {
    id: string;
    groupId: string;
    description?: string;
    title: string;
    completed: boolean;
    priority: "low" | "mid" | "high";
    date: string;
    color: string,
    groupColor: string
}

export interface IGroup {
    id: string;
    title: string;
    color: string;
    createdAt: string;
}

export interface IuiState {
    loading: {
        groups: boolean;
        todos: boolean;
        todayTodos: boolean;
        createTodo: boolean;
        createGroup: boolean;
    },
    loaded: {
        todayTodos: boolean;
    }
    errors: {
        groups: boolean;
        todos: boolean;
        todayTodos: boolean;
        createTodo: boolean;
        createGroup: boolean;
    }
    filters: {
        todos: {
            completed: 'all' | 'active' | 'completed';
            priority: 'all' | 'low' | 'medium' | 'high';
            sortBy?: 'priority' | 'date';
            sortOrder: 'asc' | 'desc';
        };
    };
    modals: {
        createGroup: boolean;
        createTodo: boolean;
        editTodo: string | null;
    };
}



export interface IRootState {
    todos: ITodo[];
    groups: IGroup[];
    todayTodos: ITodo[];
    UIstate: IuiState
}