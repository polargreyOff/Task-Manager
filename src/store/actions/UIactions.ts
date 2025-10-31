import { Action } from "../../types/actionInterfaces"
import { ActionTypes } from "../../types/types"

export const ModalOpen = (modal: string): Action => ({
    type: ActionTypes.MODAL_OPEN,
    payload: modal
})

export const ModalClose = (modal: string): Action => ({
    type: ActionTypes.MODAL_CLOSE,
    payload: modal
})

export const FiltersSet = (filterType: "priority" | "completed" | "sortOrder", value: string): Action => ({
    type: ActionTypes.FILTERS_SET,
    payload: {
        filterType,
        value
    }
})

export const FiltersReset = (): Action => ({
    type: ActionTypes.FILTERS_RESET
})