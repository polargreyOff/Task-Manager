import { Action } from "../../types/actionInterfaces";
import { ActionTypes, ITodo } from "../../types/types";
import { AppThunk } from "..";
import { getTodosRequest } from "../../services/fakeapi";
import { createTodoRequest } from "../../services/fakeapi";
import { ModalClose } from "./UIactions";

export const TodoToggle = (id: string): Action => ({
    type: ActionTypes.TODO_TOGGLE,
    payload: id
})

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

export const TodoCreateRequest = (): Action => ({
    type: ActionTypes.TODO_CREATE_REQUEST
})

export const TodoCreateSuccess = (todo: ITodo): Action => ({
    type: ActionTypes.TODO_CREATE_SUCCESS,
    payload: todo
})

export const TodoCreateFailure = (): Action => ({
    type: ActionTypes.TODO_CREATE_FAILURE
})


export const createTodo = (todoData: Omit<ITodo, 'id'>): AppThunk => async (dispatch) => {
    dispatch(TodoCreateRequest());
    
    try {
        const response = await createTodoRequest(todoData);
        if (response.success) {
            dispatch(TodoCreateSuccess(response.data.todo));
            dispatch(ModalClose("createTodo"));
        } else {
            dispatch(TodoCreateFailure());
        }
    } catch (error) {
        dispatch(TodoCreateFailure());
    }
};

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