/* eslint-disable */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';
import { getUserOrdersApi } from '@api';

export const fetchOrderByNumber = createAsyncThunk(
  'currentOrder/fetchByNumber',
  async (number: string) => {
    const numberAsNumber = Number(number);
    const data = await getOrderByNumberApi(numberAsNumber);
    return data.orders[0];
  }
)

export const postOrder = createAsyncThunk(
  'orderPost/postAll',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response;
  }
);

export const getFeed = createAsyncThunk(
  'ordersGet/getAll',
  async () => {
    const data = await getFeedsApi();
    return data;
  }
);

export const getUserOrders = createAsyncThunk(
  'userOrders/getUserOrders',
  async () => {
    const data = await getUserOrdersApi();
    return data;
  }
);


export const orderSlice = createSlice({
  name: 'orderPost',
  initialState: {
    orderData: null as TOrder | null,
    loading: false,
    error: null as string | null
  },
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload.order;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  }
})

export const getOrdersSlice = createSlice({
  name: 'ordersGet',
  initialState: {
    orders: [] as TOrder[],
    total: 0 as number,
    totalToday: 0 as number,
    loading: false,
    error: null as string | null
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        console.log('Ingredients fetch pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        console.log('API response:', action.payload);
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  }
});

export const currentOrderSlice = createSlice({
    name: 'currentOrder',
    initialState: {
      order: null as TOrder | null,
      loading: false,
      error: null as string | null
    },
    reducers: {
      clearCurrentOrder: (state) => {
        state.order = null;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchOrderByNumber.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
          state.loading = false;
          state.order = action.payload;
        })
        .addCase(fetchOrderByNumber.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || null;
        });
    }
});


export const userOrdersSlice = createSlice({
    name: 'userOrders',
    initialState: {
      orders: [] as TOrder[],
      loading: false,
      error: null as string | null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getUserOrders.pending, (state) => {
          state.loading = true;
        })
        .addCase(getUserOrders.fulfilled, (state, action) => {
          state.loading = false;
          state.orders = action.payload.orders;
          console.log('Orders saved to state:', action.payload.orders);
        })
        .addCase(getUserOrders.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Ошибка загрузки заказов';
          console.error('Error fetching orders:', action.error);
        });
    }
});

export const orderSliceReducer = orderSlice.reducer;
export const getOrdersSliceReducer = getOrdersSlice.reducer;
export const userOrderSliceReducer = userOrdersSlice.reducer;
export const currentOrderSliceReducer = currentOrderSlice.reducer;
export const { clearOrder } = orderSlice.actions;
export const { clearCurrentOrder } = currentOrderSlice.actions