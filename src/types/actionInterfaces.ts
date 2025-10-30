import { ActionTypes, IGroup, ITodo } from "./types";

interface GroupsLoadRequestAction {
    type: ActionTypes.GROUPS_LOAD_REQUEST;
}

interface GroupsLoadSuccessAction {
    type: ActionTypes.GROUPS_LOAD_SUCCESS;
    payload: IGroup[];
}

interface GroupsLoadFailureAction {
    type: ActionTypes.GROUPS_LOAD_FAILURE;
}

interface TodosLoadRequest {
    type: ActionTypes.TODOS_LOAD_REQUEST;
    // payload: string; GroupId
}

interface TodosLoadSuccess {
    type: ActionTypes.TODOS_LOAD_SUCCESS;
    payload: ITodo[]
}

interface TodosLoadFailure {
    type: ActionTypes.TODOS_LOAD_FAILURE;
}

export type Action = 
  GroupsLoadSuccessAction 
| GroupsLoadRequestAction
| GroupsLoadFailureAction
| TodosLoadRequest
| TodosLoadSuccess
| TodosLoadFailure