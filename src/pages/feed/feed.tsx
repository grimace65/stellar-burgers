/* eslint-disable */
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getFeed } from '../../services/slices/ordersSlices';
import { fetchIngredients } from '../../services/slices/ingredientsSlices';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(state => state.getOrders.orders);
  const loading = useSelector(state => state.getOrders.loading);
  const ingredients = useSelector(state => state.ingredients.items);

  useEffect(() => {
    dispatch(getFeed());
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeed());
  };

  if (loading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
