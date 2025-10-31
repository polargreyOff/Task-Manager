import { IRootState } from "../types/types";

export const initialState: IRootState ={
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
        },
        errors: {
            groups: false,
            todos: false,
            todayTodos: false,
            createTodo: false,
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