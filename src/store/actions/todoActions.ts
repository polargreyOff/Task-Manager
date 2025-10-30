import { Action } from "../../types/actionInterfaces";
import { ActionTypes, ITodo } from "../../types/types";
import { AppThunk } from "..";
import { getTodosRequest } from "../../services/fakeapi";

export const TodosLoadRequest = (): Action => ({
    type: ActionTypes.TODOS_LOAD_REQUEST,
})

export const TodosLoadSuccess = (todos: ITodo[]): Action => ({
    type: ActionTypes.TODOS_LOAD_SUCCESS,
    payload: todos
})

export const TodosLoadFailure = (): Action => ({
    type: ActionTypes.TODOS_LOAD_FAILURE
})

export const fetchTodos = (id: string): AppThunk => async (dispatch) => {
    dispatch(TodosLoadRequest());
    try {
        const response = await getTodosRequest(id);
        if (response.success) {
            dispatch(TodosLoadSuccess(response.data.todos));
        } else {
            dispatch(TodosLoadFailure());
        }
    } catch(e) {
        dispatch(TodosLoadFailure());
    }
}