import { Action } from "../../types/actionInterfaces";
import { ActionTypes, ITodo } from "../../types/types";
import { AppThunk } from "..";
import { getTodayTodosRequest } from "../../services/fakeapi";

export const TodayTodosLoadRequest = (): Action => ({
    type: ActionTypes.TODAY_TODOS_REQUEST,
})

export const TodayTodosLoadSuccess = (todos: ITodo[]): Action => ({
    type: ActionTypes.TODAY_TODOS_SUCCESS,
    payload: todos
})

export const TodayTodosLoadFailure = (): Action => ({
    type: ActionTypes.TODOS_LOAD_FAILURE
})

export const fetchTodayTodos = (): AppThunk => async (dispatch) => {
    dispatch(TodayTodosLoadRequest());
    try {
        const response = await getTodayTodosRequest();
        if (response.success) {
            dispatch(TodayTodosLoadSuccess(response.data.todos));
        } else {
            dispatch(TodayTodosLoadFailure());
        }
    } catch(e) {
        dispatch(TodayTodosLoadFailure());
    }
}