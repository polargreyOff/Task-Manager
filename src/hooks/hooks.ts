import { IRootState, ITodo } from "../types/types";
import { AppDispatch } from "../store";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useMemo } from "react";
import { IuiState } from "../types/types";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;


export const useFilteredItems = (todos: ITodo[], filters: IuiState["filters"]["todos"], groupId: string | undefined) => {
    return useMemo(() => {
        return todos.filter( todo => {
            if (todo.group_id !== groupId) return false;
            if (filters.completed === "active" && todo.completed) return false;
            if (filters.completed === "completed" && !todo.completed) return false;

            if (filters.priority !== "all" && filters.priority !== todo.priority) return false;
            return true;
        })
        .sort((a,b) => {
            if (filters.sortOrder === "asc") {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            }
            if (filters.sortOrder === "desc") {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
            return 0;
        })
    }, [todos, filters, groupId])
}