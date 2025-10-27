/* eslint-disable */
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { getUserOrders } from '../../services/slices/slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(state => state.userOrders.orders);
  const user = useSelector(state => state.user.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getUserOrders());
  }
  }, [dispatch, user]);

  console.log('User in ProfileOrders:', user);
  console.log('Orders in ProfileOrders:', orders);

  console.log('Orders in component:', orders);

  if (!user) {
    return <Preloader />
  }

  return <ProfileOrdersUI orders={orders} />;
};
