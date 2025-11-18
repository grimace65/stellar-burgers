import { clearUser, userSliceReducer } from '../../../services/slices/userSlice';
import { 
  loginUser, 
  getUser, 
  registerUser, 
  updateUser 
} from '../../../services/slices/userSlice'

describe('user slice', () => {
    const initialState = {
      user: null,
      isLoading: false,
      error: null
    };
  
    describe('registerUser', () => {
      it('производит загрузку registerUser', () => {
        const action = { type: registerUser.pending.type };
        const state = userSliceReducer(initialState, action);
        
        expect(state.isLoading).toBe(true);
        expect(state.error).toBe(null);
      });
  
      it('registerUser успешно завершен', () => {
        const mockUser = { email: 'test@test.com', name: 'Test User' };
        const action = { 
          type: registerUser.fulfilled.type, 
          payload: mockUser 
        };
        const state = userSliceReducer(initialState, action);
        
        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.error).toBe(null);
      });
  
      it('registerUser завершен с ошибкой', () => {
        const action = { 
          type: registerUser.rejected.type,
          error: { message: 'Email already exists' }
        };
        const state = userSliceReducer(initialState, action);
        
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Email already exists');
        expect(state.user).toBe(null);
      });
    });
  
    describe('loginUser', () => {
      it('loginUser успешно завершен', () => {
        const mockUser = { email: 'test@test.com', name: 'Test User' };
        const action = { 
          type: loginUser.fulfilled.type, 
          payload: mockUser 
        };
        const state = userSliceReducer(initialState, action);
        
        expect(state.user).toEqual(mockUser);
      });
  
      it('loginUser завершен с ошибкой', () => {
        const stateWithUser = {
          user: { email: 'test@test.com', name: 'Test User' },
          isLoading: false,
          error: null
        };
        
        const action = { type: loginUser.rejected.type };
        const state = userSliceReducer(stateWithUser, action);
        
        expect(state.user).toBe(null);
      });
    });
  
    describe('getUser', () => {
      it('getUser успешно завершен', () => {
        const mockUser = { email: 'test@test.com', name: 'Test User' };
        const action = { 
          type: getUser.fulfilled.type, 
          payload: mockUser 
        };
        const state = userSliceReducer(initialState, action);
        
        expect(state.user).toEqual(mockUser);
      });
    });
  
    describe('updateUser', () => {
      it('getUser завершен с ошибкой', () => {
        const mockUser = { email: 'updated@test.com', name: 'Updated User' };
        const action = { 
          type: updateUser.fulfilled.type, 
          payload: mockUser 
        };
        const state = userSliceReducer(initialState, action);
        
        expect(state.user).toEqual(mockUser);
        expect(state.isLoading).toBe(false);
      });
    });
  
    it('очищает пользователя', () => {
      const stateWithUser = {
        user: { email: 'test@test.com', name: 'Test User' },
        isLoading: false,
        error: null
      };
      
      const state = userSliceReducer(stateWithUser, clearUser());
      
      expect(state.user).toBe(null);
    });
  });