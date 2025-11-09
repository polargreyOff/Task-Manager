import { AppThunk } from "..";
// createGroupRequest, deleteGroupRequest, getGroupsRequest
// import { } from "../../services/fakeapi";
import { createGroupRequest, deleteGroupRequest, getGroupsRequest } from "../../services/api";
import { Action } from "../../types/actionInterfaces";
import { ActionTypes, IGroup } from "../../types/types";
import { ModalClose } from "./UIactions";

export const groupsLoadRequest = (): Action => ({
    type: ActionTypes.GROUPS_LOAD_REQUEST
})

export const groupsLoadSuccess = (groups: IGroup[]): Action => ({
    type: ActionTypes.GROUPS_LOAD_SUCCESS,
    payload: groups
})

export const groupsLoadFailure = (): Action => ({
    type: ActionTypes.GROUPS_LOAD_FAILURE
})

export const GroupCreateRequest = (): Action => ({
    type: ActionTypes.GROUP_CREATE_REQUEST
})

export const GroupCreateSuccess = (group: IGroup): Action => ({
    type: ActionTypes.GROUP_CREATE_SUCCESS,
    payload: group
})

export const GroupCreateFailure = (): Action => ({
    type: ActionTypes.GROUP_CREATE_FAILURE
})

export const GroupDeleteRequest = (): Action => ({
    type: ActionTypes.GROUP_DELETE_REQUEST
})
export const GroupDeleteSuccess = (groupId: string): Action => ({
    type: ActionTypes.GROUP_DELETE_SUCCESS,
    payload: groupId
})
export const GroupDeleteFailure = (): Action => ({
    type: ActionTypes.GROUP_DELETE_FAILURE
})

export const deleteGroup = (groupId: string): AppThunk => async (dispatch) => {
    dispatch(GroupDeleteRequest());
    
    try {
        const response = await deleteGroupRequest(groupId);

        if (response.success) {
            dispatch(GroupDeleteSuccess(groupId));
        } else {
            dispatch(GroupCreateFailure());
        }
    } catch(e) {
        dispatch(GroupDeleteFailure());
    }
}

export const createGroup = (GroupData: Omit<IGroup, 'id' | "createdAt">): AppThunk => async (dispatch) => {
    dispatch(GroupCreateRequest());
    
    try {
        const response = await createGroupRequest(GroupData);
        if (response.success) {
            dispatch(GroupCreateSuccess(response.data.group));
            dispatch(ModalClose("createGroup"));
        } else {
            dispatch(GroupCreateFailure());
        }
    } catch (error) {
        dispatch(GroupCreateFailure());
    }
};

export const fetchGroups = (): AppThunk => async (dispatch) => {
    dispatch(groupsLoadRequest());
    try {
        const response = await getGroupsRequest();
        if (response.success) {
            dispatch(groupsLoadSuccess(response.data.groups));
        } else {
            dispatch(groupsLoadFailure());
        }
    } catch(e) {
        dispatch(groupsLoadFailure());
    }
}