import { Action } from "../../types/actionInterfaces";
import { ActionTypes, IRootState } from "../../types/types";
import { initialState } from "../initialstate";

export const todosReducer =
    (state: IRootState["todos"] = initialState.todos, action: Action): IRootState["todos"] => {
        switch (action.type) {

            case ActionTypes.TODOS_LOAD_SUCCESS:
                const existingIds = new Set(state.map(todo => todo.id));
                const uniqueNewTodos = action.payload.filter(todo => !existingIds.has(todo.id));
                return [...state, ...uniqueNewTodos];
            default:
                return state
        }
    }