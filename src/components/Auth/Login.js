import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import InputField from "../InputField/InputField";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Divider from "@mui/material/Divider";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import { useEffect } from "react";

const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken, token } = useMyContext(); //컨텍스트
  const navigate = useNavigate(); //이동객체

  //로그인 라이브러리(react-hook-form)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      code: "",
    },
    mode: "onTouched",
  });
  //로그인 성공시 실행하는 함수
  const handleSuccessfulLogin = (token, decodedToken) => {
    const user = {
      username: decodedToken.sub,
      roles: decodedToken.roles ? decodedToken.roles.split(",") : [],
    };
    //토큰과 유저정보를 로컬스토리지에 저장
    localStorage.setItem("JWT_TOKEN", token);
    localStorage.setItem("USER", JSON.stringify(user));

    setToken(token); //토큰을 전역으로 공유

    navigate("/notes"); //모든 노트 페이지로 이동
  };

  //로그인 실행 함수
  const onLoginHandler = async (data) => {
    try {
      setLoading(true);
      // 백엔드로 로그인 요청 data는 username과 password
      const response = await api.post("/auth/public/signin", data);

      toast.success("로그인 성공!");
      reset();
      //로그인 성공시 jwt토큰을 저장
      if (response.status === 200 && response.data.jwtToken) {
        setJwtToken(response.data.jwtToken);
        const decodedToken = jwtDecode(response.data.jwtToken); //토큰암호를 풀어서
        handleSuccessfulLogin(response.data.jwtToken, decodedToken);
      } else {
        toast.error("로그인 실패! 다시 시도해 주세요.");
      }
    } catch (error) {
      if (error) {
        toast.error("유저네임 또는 패스워드가 틀립니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  //토큰이 있으면 기본페이지로
  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onLoginHandler)}
        className="sm:w-[450px] w-[360px]  shadow-custom py-8 sm:px-8 px-4"
      >
        <div>
          <h1 className="font-montserrat text-center font-bold text-3xl">
            로그인
          </h1>

          <div className="flex items-center justify-between gap-1 py-5 ">
            <Link
              to={`${apiUrl}/oauth2/authorization/google`}
              className="flex gap-1 items-center justify-center flex-1 border p-2 shadow-sm shadow-slate-200 rounded-md hover:bg-slate-300 transition-all duration-300"
            >
              <span>
                <FcGoogle className="text-2xl" />
              </span>
              <span className="font-semibold sm:text-customText text-xs">
                Login with Google
              </span>
            </Link>
            <Link
              to={`${apiUrl}/oauth2/authorization/github`}
              className="flex gap-1 items-center justify-center flex-1 border p-2 shadow-sm shadow-slate-200 rounded-md hover:bg-slate-300 transition-all duration-300"
            >
              <span>
                <FaGithub className="text-2xl" />
              </span>
              <span className="font-semibold sm:text-customText text-xs">
                Login with Github
              </span>
            </Link>
          </div>

          <Divider className="font-semibold">OR</Divider>
        </div>

        <div className="flex flex-col gap-2">
          <InputField
            label="UserName"
            required
            id="username"
            type="text"
            message="유저네임이 필요합니다"
            placeholder="유저네임 입력..."
            register={register}
            errors={errors}
          />{" "}
          <InputField
            label="Password"
            required
            id="password"
            type="password"
            message="패스워드가 필요합니다"
            placeholder="패스워드 입력..."
            register={register}
            errors={errors}
          />
        </div>
        <Buttons
          disabled={loading}
          onClickhandler={() => {}}
          className="bg-customRed font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3"
          type="text"
        >
          {loading ? <span>Loading...</span> : "로그인"}
        </Buttons>
        <p className=" text-sm text-slate-700 ">
          <Link className=" underline hover:text-black" to="/forgot-password">
            Forgot Password?
          </Link>
        </p>

        <p className="text-center text-sm text-slate-700 mt-6">
          Don't have an account?{" "}
          <Link
            className="font-semibold underline hover:text-black"
            to="/signup"
          >
            SignUp
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
