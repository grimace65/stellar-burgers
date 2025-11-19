import {rootReducer} from '../../../services/rootReducer';
it('корректно обрабатывает начальное состояние и не мутирует его при неожиданных экшенах', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const state = rootReducer(initialState, { type: 'UNKNOWN_ACTION' });
    
    expect(state).toEqual(initialState);
});