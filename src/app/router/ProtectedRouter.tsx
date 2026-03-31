import { useFetchMeQuery } from "@/shared/hooks/useAuth";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import { sendToApp } from "@/shared/webview/webview";
import { useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router";
import styled from "styled-components";

const ProtectedRouter = () => {
  const { data, isPending, isError } = useFetchMeQuery();

  //새로고침 이후에도 앱 WebView 로그인 상태 동기화
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

  if (isPending) {
    return (
      <FullscreenSpinner>
        <LoadingSpinner size="lg" message="사용자 정보를 불러오는 중..." />
      </FullscreenSpinner>
    );
  }

  if (isError || !data) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRouter;

const FullscreenSpinner = styled.div`
  width: 100%;
  min-height: 100vh;
`;
