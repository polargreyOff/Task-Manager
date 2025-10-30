import { Action } from "../../types/actionInterfaces";
import { IRootState } from "../../types/types";
import { initialState } from "../initialstate";
import { groupsReducer } from "./groupsReducer";
import { todosReducer } from "./todosReducer";
import { UIReducer } from "./UIreducer";

export const rootReducer = (state: IRootState = initialState, action: Action): IRootState => {
    return {
        UIstate: UIReducer(state.UIstate, action),
        todos: todosReducer(state.todos, action),
        groups: groupsReducer(state.groups, action),
        currentState: {
            todayTodos: [],
            selectedGroupId: ""
        }
    }
}