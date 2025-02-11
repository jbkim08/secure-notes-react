import React from "react";
import { Navigate } from "react-router-dom";
import { useMyContext } from "../store/ContextApi";
//props로 관리자 페이지
const ProtectedRoute = ({ children, adminPage }) => {
  //컨텍스트로 토큰과 어드민확인 가져옴
  const { token, isAdmin } = useMyContext();

  //1. 토큰이 없으면 로그인으로
  if (!token) {
    return <Navigate to="/login" />;
  }

  //2. 토큰이 있고 관리자페이고 관리자가 아니면 접속거부
  if (token && adminPage && !isAdmin) {
    return <Navigate to="/access-denied" />;
  }

  return children;
};

export default ProtectedRoute;
