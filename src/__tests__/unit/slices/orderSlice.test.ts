import { orderSliceReducer, clearOrder } from '../../../services/slices/ordersSlices';
import { postOrder } from '../../../services/slices/ordersSlices';

describe('order slice', () => {
    const initialState = {
        orderData: null,
        loading: false,
        error: null
    };

    it('производит загрузку postOrder', () => {
        const action = { type: postOrder.pending.type };
        const state = orderSliceReducer(initialState, action);
        
        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
    });

    it('postOrder успешно завершен', () => {
        const mockOrder = { number: 12345, ingredients: [], _id: '1' };
        const action = { 
          type: postOrder.fulfilled.type, 
          payload: { order: mockOrder } 
        };
        const state = orderSliceReducer(initialState, action);
        
        expect(state.loading).toBe(false);
        expect(state.orderData).toEqual(mockOrder);
        expect(state.error).toBe(null);
    });

    it('postOrder завершен с ошибкой', () => {
        const action = { 
            type: postOrder.rejected.type,
            error: { message: 'Network error' }
        };
        const state = orderSliceReducer(initialState, action);
        
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Network error');
        expect(state.orderData).toBe(null);
    });

    it('очищает заказ', () => {
        const stateWithOrder = {
          orderData: null,
          loading: false,
          error: null
        };
        
        const state = orderSliceReducer(stateWithOrder, clearOrder());
        
        expect(state.orderData).toBe(null);
    });
})