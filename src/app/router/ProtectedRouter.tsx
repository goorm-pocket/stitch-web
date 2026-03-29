import { useFetchMeQuery } from "@/shared/hooks/useAuth";
import { sendToApp } from "@/shared/webview/webview";
import { useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRouter = () => {
  const { data, isPending, isError } = useFetchMeQuery();

  //앱에 로그인 성공 전송
  const hasSentLoginSuccessRef = useRef(false);

  useEffect(() => {
    if (!data || hasSentLoginSuccessRef.current) return;

    sendToApp({
      type: "LOGIN_SUCCESS",
      payload: {
        userId: data.userId,
        status: data.status,
        isAgreed: data.isAgreed,
      },
    });
    hasSentLoginSuccessRef.current = true;
  }, [data]);

  if (isPending) return <div>로딩 중...</div>;

  if (isError || !data) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRouter;
