import { useMEQuery } from "@/services/api";
import { Navigate, Outlet } from "react-router-dom";

const AuthProtected = () => {
  const { data, isLoading, isError } = useMEQuery();

  if (isLoading) return null; // loader qo‘ysa ham bo‘ladi

  if (!data || isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthProtected;
