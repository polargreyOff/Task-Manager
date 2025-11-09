import { Action } from "../../types/actionInterfaces";
import { ActionTypes, ITodo } from "../../types/types";
import { AppThunk } from "..";
// import { getTodayTodosRequest } from "../../services/fakeapi";
import { getTodayTodosRequest } from "../../services/api";

export const TodayTodosLoadRequest = (): Action => ({
    type: ActionTypes.TODAY_TODOS_REQUEST,
})

export const TodayTodosLoadSuccess = (todos: ITodo[]): Action => ({
    type: ActionTypes.TODAY_TODOS_SUCCESS,
    payload: todos
})

export const TodayTodosLoadFailure = (): Action => ({
    type: ActionTypes.TODAY_TODOS_FAILURE
})

export const fetchTodayTodos = (): AppThunk => async (dispatch) => {
    console.log("fetch todayTodos")
    dispatch(TodayTodosLoadRequest());
    try {
        const response = await getTodayTodosRequest();
        if (response.success) {
            console.log(response.data.todos)
            dispatch(TodayTodosLoadSuccess(response.data.todos));
        } else {
            dispatch(TodayTodosLoadFailure());
        }
    } catch(e) {
        dispatch(TodayTodosLoadFailure());
    }
}