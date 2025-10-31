import { Action } from "../../types/actionInterfaces";
import { ActionTypes, IRootState } from "../../types/types";
import { initialState } from "../initialstate";

export const TodayTodosReducer =
    (state: IRootState["todayTodos"] = initialState.todayTodos, action: Action): IRootState["todayTodos"] => {
        switch (action.type) {

            case ActionTypes.TODAY_TODOS_SUCCESS:
                return [...action.payload]
            default:
                return state
        }
}