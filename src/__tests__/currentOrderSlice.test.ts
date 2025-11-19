import { currentOrderSliceReducer } from "../services/slices/ordersSlices";
import { fetchOrderByNumber, clearCurrentOrder } from '../services/slices/ordersSlices';

describe('order slice', () => {
    const initialState = {
        order: null,
        loading: false,
        error: null
    };

    it('производит загрузку currentOrder', () => {
        const action = { type: fetchOrderByNumber.pending.type };
        const state = currentOrderSliceReducer(initialState, action);
        
        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
    });

    it('currentOrder успешно завершен', () => {
        const mockOrder = { number: 12345, ingredients: [], _id: '1' };
        const action = { 
          type: fetchOrderByNumber.fulfilled.type, 
          payload: mockOrder
        };
        const state = currentOrderSliceReducer(initialState, action);
        
        expect(state.loading).toBe(false);
        expect(state.order).toEqual(mockOrder);
        expect(state.error).toBe(null);
    });

    it('currentOrder завершен с ошибкой', () => {
        const action = { 
            type: fetchOrderByNumber.rejected.type,
            error: { message: 'Network error' }
        };
        const state = currentOrderSliceReducer(initialState, action);
        
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Network error');
        expect(state.order).toBe(null);
    });

    it('очищает заказ', () => {
        const stateWithOrder = {
          order: null,
          loading: false,
          error: null
        };
        
        const state = currentOrderSliceReducer(stateWithOrder, clearCurrentOrder());
        
        expect(state.order).toBe(null);
    });
})