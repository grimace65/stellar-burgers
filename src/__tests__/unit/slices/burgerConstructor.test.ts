import { rootReducer } from '../../../services/rootReducer';
import {burgerConstructorReducer, addBun, addIngredient, removeIngr, moveIngredient, clearConstructor} from '../../../services/slices/ingredientsSlices';

describe('rootReducer', () => {
  it('должен инициализировать rootReducer', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    
    expect(state).toEqual({
        ingredients: expect.any(Object),
        burgerConstructor: expect.any(Object),
        order: expect.any(Object),
        getOrders: expect.any(Object),
        user: expect.any(Object),
        userOrders: expect.any(Object),
        currentOrder: expect.any(Object)
    });
  });
  it('должен инициализировать burgerConstructor', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    
    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: [],
      totalPrice: 0
    });
  });
  it('должен корректно инициализировать все слайсы', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    
    expect(state.ingredients).toBeDefined();
    expect(state.burgerConstructor).toBeDefined();
    expect(state.order).toBeDefined();
    expect(state.getOrders).toBeDefined();
    expect(state.user).toBeDefined();
    expect(state.userOrders).toBeDefined();
    expect(state.currentOrder).toBeDefined();
  });
})

const mockBun = {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun' as const,
    price: 1255,
    image: 'image_url',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    image_mobile: 'mobile_url',
    image_large: 'large_url',
    __v: 0
  };
  
  const mockMainIngredient = {
    _id: 'main-1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main' as const,
    price: 424,
    image: 'image_url',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    image_mobile: 'mobile_url',
    image_large: 'large_url',
    __v: 0
  };
  
  const mockSauceIngredient = {
    _id: 'sauce-1',
    name: 'Соус традиционный галактический',
    type: 'sauce' as const,
    price: 100,
    image: 'image_url',
    proteins: 10,
    fat: 5,
    carbohydrates: 15,
    calories: 50,
    image_mobile: 'mobile_url',
    image_large: 'large_url',
    __v: 0
  };
  
describe('burgerConstructor reducer', () => {
    const initialState = {
        bun: null,
        ingredients: [],
        totalPrice: 0
    };
    it('возвращает начальное состояние', () => {
        const result = burgerConstructorReducer(undefined, { type: 'unknown' });
      
        expect(result).toEqual(initialState);
    });

describe('addIngredient action', () => {
    it('добавляет булку', () => {
        const action = addBun(mockBun);
        const result = burgerConstructorReducer(initialState, action);
  
        expect(result.bun).toEqual(mockBun);
        expect(result.ingredients).toHaveLength(0);
    });
  
    it('меняет текущую булку на новую при добавлении второй', () => {
        const firstBun = { ...mockBun, _id: 'bun-1' };
        const secondBun = { ...mockBun, _id: 'bun-2' };

        let state = burgerConstructorReducer(initialState, addBun(firstBun));
        expect(state.bun?._id).toBe('bun-1');
  
        state = burgerConstructorReducer(state, addBun(secondBun));
        expect(state.bun?._id).toBe('bun-2');
    });
  
    it('добавляет ингредиенты', () => {
        let state = burgerConstructorReducer(initialState, addIngredient(mockMainIngredient));
        state = burgerConstructorReducer(state, addIngredient(mockSauceIngredient));
  
        expect(state.ingredients).toHaveLength(2);
        expect(state.ingredients[0]._id).toBe('main-1');
        expect(state.ingredients[1]._id).toBe('sauce-1');
    });
});
  
describe('removeIngredient action', () => {
    it('удаляет ингредиент при помощи uniqueId', () => {
        let state = burgerConstructorReducer(initialState, addIngredient(mockMainIngredient));
        state = burgerConstructorReducer(state, addIngredient(mockSauceIngredient));
  
        expect(state.ingredients).toHaveLength(2);

        const ingredientToRemoveId = state.ingredients[0].uniqueId!;

        const removeAction = removeIngr(ingredientToRemoveId);
        state = burgerConstructorReducer(state, removeAction);
  
        expect(state.ingredients).toHaveLength(1);
        expect(state.ingredients[0]._id).toBe('sauce-1');
    });
  
    it('ничего не удаляет при не найденном uniqueId', () => {
        let state = burgerConstructorReducer(initialState, addIngredient(mockMainIngredient));
        const initialIngredientsCount = state.ingredients.length;

        const removeAction = removeIngr('non-existent-unique-id');
        state = burgerConstructorReducer(state, removeAction);
  
        expect(state.ingredients).toHaveLength(initialIngredientsCount);
    });
});

describe('moveIngredient action', () => {
    let stateWithIngredients: any;
  
    beforeEach(() => {
        stateWithIngredients = {
            bun: mockBun,
            ingredients: [
                { ...mockMainIngredient, _id: '1', uniqueId: 'unique-1' },
                { ...mockSauceIngredient, _id: '2', uniqueId: 'unique-2' },
                { ...mockMainIngredient, _id: '3', uniqueId: 'unique-3' }
            ]
        };
    });
  
    it('перемещает ингредиент из начала в конец', () => {
        const action = moveIngredient({ fromIndex: 0, toIndex: 2 });
        const result = burgerConstructorReducer(stateWithIngredients, action);
    
        expect(result.ingredients.map((ing: any) => ing._id))
            .toEqual(['2', '3', '1']); 
        });

describe('clearConstructor action', () => {
    it('очищает конструктор', () => {
        const stateWithData = {
            bun: mockBun,
            ingredients: [
                { ...mockMainIngredient, _id: '1', uniqueId: 'unique-1' },
                { ...mockSauceIngredient, _id: '2', uniqueId: 'unique-2' }
            ],
            totalPrice: 12345
        };
    
        const result = burgerConstructorReducer(stateWithData, clearConstructor());
    
        expect(result.bun).toBeNull();
        expect(result.ingredients).toHaveLength(0);
    });
});
})
})