import { useMEQuery } from "@/services/api";
import { Navigate } from "react-router-dom";

const RoleProtected = ({ children, allowedRoles }) => {
  const { data } = useMEQuery();

  // admin superuser
  if (data?.role === "admin") return children;

  if (!allowedRoles.includes(data?.role)) {
    return <Navigate to="/401" replace />;
  }

  return children;
};

export default RoleProtected;
