import { Action } from "../../types/actionInterfaces";
import {ActionTypes, IRootState } from "../../types/types";
import { initialState } from "../initialstate";

export const UIReducer = 
(state: IRootState["UIstate"] = initialState["UIstate"] , action: Action): IRootState["UIstate"] => 
{
    switch(action.type) {
        case ActionTypes.GROUPS_LOAD_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    groups: true
                },
                errors: {
                    ...state.errors,
                    groups: false,
                }
            }
        case ActionTypes.GROUPS_LOAD_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    groups: false
                }
            }
        case ActionTypes.GROUPS_LOAD_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    groups: false
                },
                errors: {
                    ...state.errors,
                    groups: true
                }
            }
        case ActionTypes.TODOS_LOAD_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    todos: true
                },
                errors: {
                    ...state.errors,
                    todos: false
                }
            }
        case ActionTypes.TODOS_LOAD_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    todos: false
                }
            }
        case ActionTypes.TODOS_LOAD_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    todos: false
                },
                errors: {
                    ...state.errors,
                    todos: true
                }
            }
            case ActionTypes.TODAY_TODOS_REQUEST:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    todayTodos: true
                },
                errors: {
                    ...state.errors,
                    todayTodos: false
                },
                loaded: {
                    todayTodos: false
                }
            }
        case ActionTypes.TODAY_TODOS_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    todayTodos: false
                },
                loaded: {
                    todayTodos: true
                }
            }
        case ActionTypes.TODAY_TODOS_FAILURE:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    todayTodos: false
                },
                errors: {
                    ...state.errors,
                    todayTodos: true
                },
                loaded: {
                    todayTodos: false
                }
            }
        default:
             return state
    }
}