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
import { getUser } from '../../services/slices/userSlice';
import { ProtectedRoute } from '../protected-route';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchIngredients } from '../../services/slices/ingredientsSlices';

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  useEffect(() => {
    const token = getCookie('accessToken');
    if (token) {
      dispatch(getUser());
    }
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/profile/orders" element={
          <ProtectedRoute>
            <ProfileOrders />
          </ProtectedRoute>
        } />
        
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route path="/profile/orders/:number" element={
          <ProtectedRoute>
            <OrderInfo />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/feed/:number"
            element={
              <Modal title="Детали заказа" onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <Modal title="Детали заказа" onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;