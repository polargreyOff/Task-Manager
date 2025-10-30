import { createStore, applyMiddleware, Store } from 'redux';
import {thunk, ThunkAction } from 'redux-thunk';
import { rootReducer } from './reducers';
import { IRootState } from '../types/types';
import { Action } from '../types/actionInterfaces';
import { ThunkDispatch } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  IRootState,
  unknown,
  Action
>;

export const store: Store<IRootState, Action> = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export type AppDispatch = ThunkDispatch<IRootState, unknown, Action>;
