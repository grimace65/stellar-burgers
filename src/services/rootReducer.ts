/* eslint-disable */
import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlices';
import { burgerConstructorReducer } from './slices/ingredientsSlices';
import { orderSliceReducer } from './slices/ordersSlices';
import { getOrdersSliceReducer } from './slices/ordersSlices';
import { userSliceReducer } from './slices/userSlice';
import { userOrderSliceReducer } from './slices/ordersSlices';
import { currentOrderSliceReducer } from './slices/ordersSlices';
import { get } from 'http';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderSliceReducer,
  getOrders: getOrdersSliceReducer,
  user: userSliceReducer,
  userOrders: userOrderSliceReducer,
  currentOrder: currentOrderSliceReducer
});