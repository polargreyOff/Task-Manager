import { IRootState } from "../types/types";

export const initialState: IRootState ={
    auth: {
        isAuthenticated: false,
        loading: false,
        username: "",
        error: false
    },
    todos: [],
    groups: [],
    todayTodos: [],
    UIstate: {
        loaded: {
            todayTodos: false
        },
        loading: {
            groups: false,
            todos: false,
            todayTodos: false,
            createTodo: false,
            createGroup: false
        },
        errors: {
            groups: false,
            todos: false,
            todayTodos: false,
            createTodo: false,
            createGroup: false
        },
        filters: {
            todos: {
                completed: "all",
                priority: "all",
                sortBy: "date",
                sortOrder:"asc"
            }
        },
        modals: {
            createGroup: false,
            createTodo: false,
            editTodo: null
        }
    }
}