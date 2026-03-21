import { type ComponentType } from "react";
import { Navigate } from "react-router";
import { useFetchMeQuery } from "../hooks/useAuth";

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { data, isPending, isError } = useFetchMeQuery();

    if (isPending) {
      return <div>로딩 중...</div>;
    }

    if (isError || !data) {
      return <Navigate to="/" replace />;
    }

    return <WrappedComponent {...props} />;
  };
}
