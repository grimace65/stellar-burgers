/* eslint-disable */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import { orderBurgerApi } from '@api';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import { TUser } from '@utils-types';
import { loginUserApi } from '@api';
import { getUserApi } from '@api';
import { getUserOrdersApi } from '@api';
import { registerUserApi } from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { updateUserApi } from '@api';
import { logoutApi } from '@api';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

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

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }) => {
    const data = await loginUserApi(credentials);
    
    if (data.success) {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      return data.user;
    }
    throw new Error('error');
  }
);

export const getUser = createAsyncThunk(
  'user/getUser', 
  async () => {
    const data = await getUserApi();
    return data.user;
  }
);

export const getUserOrders = createAsyncThunk(
  'userOrders/getUserOrders',
  async () => {
    const data = await getUserOrdersApi();
    return data;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: { name: string; email: string; password: string }) => {
    const data = await registerUserApi(userData);
    return data.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: { name: string; email: string; password?: string }) => {
    const data = await updateUserApi(userData);
    return data.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async () => {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    items: [] as TIngredient[],
    loading: false,
    error: null as string | null
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        console.log('Ingredients fetch pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  }
});

export const burgerConstructorSlice = createSlice({
    name: 'burgerConstructor',
    initialState: {
      bun: null as TIngredient | null,
      ingredients: [] as (TIngredient & { uniqueId: string })[],
      totalPrice: 0 as number
    },
    reducers: {
        addBun: (state, action: PayloadAction<TIngredient>) => {
          if (state.bun) {
            state.totalPrice -= state.bun.price * 2;
          }
            state.bun = action.payload;
            state.totalPrice += action.payload.price * 2;
          },
        addIngredient: (state, action: PayloadAction<TIngredient>) => {
          const ingredientWithId = {
            ...action.payload,
            uniqueId: `${action.payload._id}-${Math.random()}`
          };
            state.ingredients.push(ingredientWithId);
            state.totalPrice += action.payload.price
        },
        removeIngr: (state, action: PayloadAction<string>) => {
          const ingredient = state.ingredients.find(item => item.uniqueId === action.payload)
          if (ingredient) {
            state.totalPrice -= ingredient.price
          }
          state.ingredients = state.ingredients.filter(item => item.uniqueId !== action.payload)
        },
        moveIngredient: (state, action: PayloadAction<{fromIndex: number, toIndex: number}>) => {
          const { fromIndex, toIndex } = action.payload;
          const ingredients = [...state.ingredients];
          const [movedItem] = ingredients.splice(fromIndex, 1);
          ingredients.splice(toIndex, 0, movedItem);
          state.ingredients = ingredients;
        },
        clearConstructor: (state) => {
          state.bun = null;
          state.ingredients = [];
          state.totalPrice = 0;
        }
    }
});

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
        console.log('Ingredients fetch pending');
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

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null as TUser | null,
    isLoading: false,
    error: null as string | null
  },
  reducers: {
    clearUser: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
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

export const ingredientsReducer = ingredientsSlice.reducer;
export const burgerConstructorReducer = burgerConstructorSlice.reducer;
export const orderSliceReducer = orderSlice.reducer;
export const getOrdersSliceReducer = getOrdersSlice.reducer;
export const userSliceReducer = userSlice.reducer;
export const userOrderSliceReducer = userOrdersSlice.reducer;
export const { addBun, addIngredient, removeIngr, moveIngredient, clearConstructor } = burgerConstructorSlice.actions;
export const { clearOrder } = orderSlice.actions;
export const { clearUser } = userSlice.actions;