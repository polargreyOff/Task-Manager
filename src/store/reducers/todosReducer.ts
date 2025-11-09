import { Action } from "../../types/actionInterfaces";
import { ActionTypes, IRootState } from "../../types/types";
import { initialState } from "../initialstate";

export const todosReducer =
    (state: IRootState["todos"] = initialState.todos, action: Action): IRootState["todos"] => {
        switch (action.type) {
            case ActionTypes.TODO_TOGGLE:
                return state.map(todo =>
                    todo.id === action.payload
                        ? { ...todo, completed: !todo.completed }
                        : todo
                );
            case ActionTypes.TODO_DELETE_SUCCESS:
                return [...state.filter(todo => todo.id !== action.payload)]

            case ActionTypes.TODOS_LOAD_SUCCESS:
                const existingIds = new Set(state.map(todo => todo.id));
                const uniqueNewTodos = action.payload.filter(todo => !existingIds.has(todo.id));
                return [...state, ...uniqueNewTodos];
                
            case ActionTypes.TODO_CREATE_SUCCESS:
                return [...state, action.payload]

            case ActionTypes.GROUP_DELETE_SUCCESS:
                console.log("todos reducer group delete")
                return [...state.filter(todo => todo.group_id !== action.payload)]
            default:
                return state
        }
    }