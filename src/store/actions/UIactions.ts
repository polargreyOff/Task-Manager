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