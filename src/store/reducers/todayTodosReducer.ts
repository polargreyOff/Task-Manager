import { Action } from "../../types/actionInterfaces";
import { ActionTypes, IRootState } from "../../types/types";
import { initialState } from "../initialstate";

export const TodayTodosReducer =
    (state: IRootState["todayTodos"] = initialState.todayTodos, action: Action): IRootState["todayTodos"] => {
        switch (action.type) {

            case ActionTypes.TODAY_TODOS_SUCCESS:
                const existingIds = new Set(state.map(todo => todo.id));
                const uniqueNewTodos = action.payload.filter(todo => !existingIds.has(todo.id));
                return [...state, ...uniqueNewTodos];
            default:
                return state
        }
}