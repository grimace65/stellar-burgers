/* eslint-disable */
import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from '../../services/store';
import { useDispatch } from '../../services/store';
import { clearOrder, postOrder } from '../../services/slices/slice';
import { clearConstructor } from '../../services/slices/slice';

export const BurgerConstructor: FC = () => {
  const addedConstructorItems = useSelector(state => state.burgerConstructor);
  const constructorItems = {
    bun: addedConstructorItems.bun,
    ingredients: addedConstructorItems.ingredients
  };
  const dispatch = useDispatch();

  const orderRequest = useSelector(state => state.order.loading);

  const orderModalData = useSelector(state => state.order.orderData);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(item => item._id)
    ];
    dispatch(postOrder(ingredientsIds));
  };
  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const price = addedConstructorItems.totalPrice;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
