import { Action } from "../../types/actionInterfaces";
import {ActionTypes, IRootState } from "../../types/types";
import { initialState } from "../initialstate";

export const groupsReducer = 
(state: IRootState["groups"] = initialState.groups , action: Action): IRootState["groups"] => 
{  
    switch(action.type) {
        case ActionTypes.GROUPS_LOAD_SUCCESS:
            return [
               ...action.payload
            ]
        default:
             return state
    }
}