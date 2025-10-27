/* eslint-disable */
import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/slice';
import { burgerConstructorReducer } from './slices/slice';
import { orderSliceReducer } from './slices/slice';
import { getOrdersSliceReducer } from './slices/slice';
import { userSliceReducer } from './slices/slice';
import { userOrderSliceReducer } from './slices/slice';
import { get } from 'http';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderSliceReducer,
  getOrders: getOrdersSliceReducer,
  user: userSliceReducer,
  userOrders: userOrderSliceReducer,
});