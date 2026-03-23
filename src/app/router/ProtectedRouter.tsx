import { useFetchMeQuery } from "@/shared/hooks/useAuth";
import { Navigate, Outlet } from "react-router";

const ProtectedRouter = () => {
  const { data, isPending, isError } = useFetchMeQuery();

  if (isPending) return <div>로딩 중...</div>;

  if (isError || !data) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRouter;
