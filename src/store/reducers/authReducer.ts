import { IRootState } from "../../types/types"
import { initialState } from "../initialstate"
import { Action } from "../../types/actionInterfaces"
import { ActionTypes } from "../../types/types"

export const authReducer = 
(state: IRootState["auth"] = initialState.auth , action: Action): IRootState["auth"] => 
{  
    switch(action.type) {
        case ActionTypes.LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: false
            }
        case ActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                username: action.payload,
                isAuthenticated: true,
                error: false
            }
        case ActionTypes.LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            }
        case ActionTypes.REGISTER_REQUEST:
            return {
                ...state,
                loading: true,
                error: false
            }
        case ActionTypes.REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                username: action.payload,
                error: false,
                isAuthenticated: true
            }
        case ActionTypes.REGISTER_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            }
        case ActionTypes.LOGOUT:
            return initialState.auth
        default:
            return state
    }
}