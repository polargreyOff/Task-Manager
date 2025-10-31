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

interface TodayTodosLoadRequest {
    type: ActionTypes.TODAY_TODOS_REQUEST
}

interface TodayTodosLoadSuccess {
    type: ActionTypes.TODAY_TODOS_SUCCESS,
    payload: ITodo[]
}

interface TodayTodosLoadFailure {
    type: ActionTypes.TODAY_TODOS_FAILURE
}

interface TodoCreateRequest {
    type: ActionTypes.TODO_CREATE_REQUEST
}

interface TodoCreateSuccess {
    type: ActionTypes.TODO_CREATE_SUCCESS,
    payload: ITodo
}

interface TodoCreateFailure {
    type: ActionTypes.TODO_CREATE_FAILURE
}

interface ModalOpen {
    type: ActionTypes.MODAL_OPEN,
    payload: string
}

interface ModalClose {
    type: ActionTypes.MODAL_CLOSE,
    payload: string
}

interface TodoToggle {
    type: ActionTypes.TODO_TOGGLE,
    payload: string
}

export type Action = 
  GroupsLoadSuccessAction 
| GroupsLoadRequestAction
| GroupsLoadFailureAction
| TodosLoadRequest
| TodosLoadSuccess
| TodosLoadFailure
| TodayTodosLoadFailure
| TodayTodosLoadRequest
| TodayTodosLoadSuccess
| TodoCreateRequest
| TodoCreateFailure
| TodoCreateSuccess
| ModalClose
| ModalOpen
| TodoToggle