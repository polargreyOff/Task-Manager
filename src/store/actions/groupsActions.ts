import { AppThunk } from "..";
import { getGroupsRequest } from "../../services/fakeapi";
import { Action } from "../../types/actionInterfaces";
import { ActionTypes, IGroup } from "../../types/types";

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