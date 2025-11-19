/* eslint-disable */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    const data = await getIngredientsApi();
    return data;
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

export const { addBun, addIngredient, removeIngr, moveIngredient, clearConstructor } = burgerConstructorSlice.actions;
export const ingredientsReducer = ingredientsSlice.reducer;
export const burgerConstructorReducer = burgerConstructorSlice.reducer;