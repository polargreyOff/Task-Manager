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
            todayTodos: false
        },
        errors: {
            groups: false,
            todos: false,
            todayTodos: false
        },
        filters: {
            todos: {
                completed: "all",
                priority: "all",
                sortBy: "createdAt",
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