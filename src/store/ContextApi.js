import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
  //JWT 토큰을 로컬스토리지에서 가져옴
  const getToken = localStorage.getItem("JWT_TOKEN")
    ? JSON.stringify(localStorage.getItem("JWT_TOKEN"))
    : null;
  //유저가 관리자인지 로컬스토리지에서 가져옴 (true/false)
  const isADmin = localStorage.getItem("IS_ADMIN")
    ? JSON.stringify(localStorage.getItem("IS_ADMIN"))
    : false;

  //토큰 스테이트
  const [token, setToken] = useState(getToken);

  //인증된 유저
  const [currentUser, setCurrentUser] = useState(null);
  //사이드바
  const [openSidebar, setOpenSidebar] = useState(true);
  //관리자
  const [isAdmin, setIsAdmin] = useState(isADmin);
  //유저정보를 가져오는 함수
  const fetchUser = async () => {
    const user = JSON.parse(localStorage.getItem("USER"));

    if (user?.username) {
      try {
        const { data } = await api.get(`/auth/user`); //현재 인증된 유저정보
        const roles = data.roles; //유저권한

        if (roles.includes("ROLE_ADMIN")) {
          localStorage.setItem("IS_ADMIN", JSON.stringify(true)); //관리자 true로 저장
          setIsAdmin(true);
        } else {
          localStorage.removeItem("IS_ADMIN"); //로컬스토리지에서 제거
          setIsAdmin(false); //관리자 false 저장
        }
        setCurrentUser(data); //유저데이터 저장
      } catch (error) {
        console.error("현재 유저를 가져오는데 실패!", error);
        toast.error("현재 유저를 가져오는데 실패!");
      }
    }
  };

  useEffect(() => {
    if (token) {
      //토큰이 있는 경우에만
      fetchUser();
    }
  }, [token]); //처음 시작시 그리고 토큰이 바뀔때마다 현재 유저정보를 가져옴

  //컨텍스트가 제공하는 전역 값들
  return (
    <ContextApi.Provider
      value={{
        token,
        setToken,
        currentUser,
        setCurrentUser,
        openSidebar,
        setOpenSidebar,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </ContextApi.Provider>
  );
};

//useMyContext() 를 사용해서 useContext와 ContextApi를 import 함
export const useMyContext = () => {
  const context = useContext(ContextApi);

  return context;
};
