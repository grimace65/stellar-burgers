/* eslint-disable */
import { useSelector } from "../services/store";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const user = useSelector(state => state.user.user);
    const location = useLocation();
  
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return children;
  };