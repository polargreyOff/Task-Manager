import { authService } from "../../services/auth";
import { Action } from "../../types/actionInterfaces";
import { ActionTypes } from "../../types/types";
import { loginRequest, registerRequest } from "../../services/api";
import { AppThunk } from "..";
import { getProfileRequest } from "../../services/api";

export const authLoginRequest = (): Action => ({
    type: ActionTypes.LOGIN_REQUEST
})

export const authLoginSuccess = (username: string): Action => ({
    type: ActionTypes.LOGIN_SUCCESS,
    payload: username
})

export const authLoginFailure = (): Action => ({
    type: ActionTypes.LOGIN_FAILURE
})

export const authRegisterRequest = (): Action => ({
    type: ActionTypes.REGISTER_REQUEST
})

export const authRegisterSuccess = (username: string): Action => ({
    type: ActionTypes.REGISTER_SUCCESS,
    payload: username
})

export const authRegisterFailure = (): Action => ({
    type: ActionTypes.REGISTER_FAILURE
})

export const authLogout = (): Action => ({
    type: ActionTypes.LOGOUT
})

// Логин
export const login = (credentials: { email: string; password: string }): AppThunk => async (dispatch) => {
  dispatch(authLoginRequest());
  
  try {
    const response = await loginRequest(credentials);
    
    if (response.success) {

      authService.setTokens(response.data.accessToken, response.data.refreshToken);
      
      dispatch(authLoginSuccess(
       response.data.user.username
      ));
    } else {
      dispatch(authLoginFailure());
    }
  } catch (error: any) {
    dispatch(authLoginFailure());
  }
};

// Регистрация
export const register = (userData: { email: string; password: string; username: string }): AppThunk => async (dispatch) => {
  dispatch(authRegisterRequest());
  
  try {
    const response = await registerRequest(userData);
    
    if (response.success) {
      authService.setTokens(response.data.accessToken, response.data.refreshToken);
      
      dispatch(authRegisterSuccess(
        response.data.user.username
      ));
    } else {
      dispatch(authRegisterFailure());
    }
  } catch (error: any) {
    dispatch(authRegisterFailure());
  }
};

// Выход
export const logout = (): AppThunk => async (dispatch) => {
  try {
    // Можно отправить запрос на сервер для инвалидации токена
    // await logoutRequest();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    authService.clearTokens();
    dispatch(authLogout());
    window.location.href = '/login';
  }
};

export const checkAuth = (): AppThunk => async (dispatch) => {
  const token = authService.getAccessToken();
  
  if (token) {
    try {
      // Делаем тестовый запрос к защищенному эндпоинту
      const response = await getProfileRequest();
      
      if (response.success) {
        // Токен валиден
        dispatch(authLoginSuccess(response.data.user.username));
      }
    } catch (error) {
      // Токен невалиден - очищаем
      authService.clearTokens();
      dispatch(authLogout());
    }
  } else {
    // Токена нет
    dispatch(authLogout());
  }
};