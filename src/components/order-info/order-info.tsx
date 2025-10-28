/* eslint-disable */
import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/ordersSlices';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const ordersFromFeed = useSelector(state => state.getOrders.orders);
  const ordersFromProfile = useSelector(state => state.userOrders.orders);
  const ingredients = useSelector(state => state.ingredients.items);
  const currentOrder = useSelector(state => state.currentOrder.order);
    
  // const orderData = useMemo(() => {
  //   return ordersFromFeed.find(order => order.number === Number(number)) ||
  //   ordersFromProfile.find(order => order.number === Number(number));
  // }, [ordersFromFeed, ordersFromProfile, number]);

  const orderFromStore = useMemo(() => {
    return ordersFromFeed.find(order => order.number === Number(number)) ||
    ordersFromProfile.find(order => order.number === Number(number));
  }, [ordersFromFeed, ordersFromProfile, number]);

  useEffect(() => {
    if (!orderFromStore && number) {
      dispatch(fetchOrderByNumber(number));
    }
  }, [dispatch, number, orderFromStore]);

  const orderData = orderFromStore || currentOrder;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
