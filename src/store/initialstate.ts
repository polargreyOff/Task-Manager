import { IRootState } from "../types/types";

export const initialState: IRootState ={
    todos: [],
    groups: [],
    currentState: {
        selectedGroupId: "",
        todayTodos: [],
    },
    UIstate: {
        loading: {
            groups: false,
            todos: false,
        },
        errors: {
            groups: false,
            todos: false
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