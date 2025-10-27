/* eslint-disable */
import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Feed, Login, Register, ForgotPassword, ResetPassword, Profile, ProfileOrders, NotFound404 } from '@pages';
import { Modal } from '@components';
import { OrderInfo } from '@components';
import { IngredientDetails } from '@components';
import { useEffect } from 'react';
import { getCookie } from '../../utils/cookie';
import { useDispatch } from '../../services/store';
import { getUser } from '../../services/slices/slice';
import { ProtectedRoute } from '../protected-route';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = getCookie('accessToken');
    if (token) {
      dispatch(getUser());
    }
  }, []);
  return (
    <Router>
      <div className={styles.app}>
        <AppHeader />
        <Routes>
          <Route path="/" element={<ConstructorPage />} />
          <Route path="/feed" element={<Feed />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/profile' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path='/profile/orders' element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          } />
          <Route path='*' element={<NotFound404 />} />
          <Route path='/feed/:number' element={
            <Modal title="Детали заказа" onClose={() => window.history.back()}>
              <OrderInfo />
            </Modal>
          } />
          <Route path='/ingredients/:id' element={
            <Modal title="Детали ингредиента" onClose={() => window.history.back()}>
              <IngredientDetails />
            </Modal>
          } />
          <Route path='/profile/orders/:number' element={
            <Modal title="Детали заказа" onClose={() => window.history.back()}>
              <OrderInfo />
            </Modal>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;