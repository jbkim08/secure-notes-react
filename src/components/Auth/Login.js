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
  // 로그인 페이지
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  // 컨텍스트로 토큰 가져옴
  const { setToken, token } = useMyContext();
  const navigate = useNavigate(); //이동객체

  //리액트 훅 폼 사용
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

  //로그인 성공시
  const handleSuccessfulLogin = (token, decodedToken) => {
    const user = {
      username: decodedToken.sub,
      roles: decodedToken.roles ? decodedToken.roles.split(",") : [],
    };
    localStorage.setItem("JWT_TOKEN", token);
    localStorage.setItem("USER", JSON.stringify(user));

    //컨텍스트에 토큰을 저장
    setToken(token);

    navigate("/notes"); //노트 페이지로 이동
  };

  //로그인 함수
  const onLoginHandler = async (data) => {
    try {
      setLoading(true); //로딩시작
      const response = await api.post("/auth/public/signin", data);

      toast.success("로그인 성공!");
      reset(); //입력창 리셋

      if (response.status === 200 && response.data.jwtToken) {
        setJwtToken(response.data.jwtToken);
        const decodedToken = jwtDecode(response.data.jwtToken);
        console.log(decodedToken); //토큰해석
        handleSuccessfulLogin(response.data.jwtToken, decodedToken);
      } else {
        toast.error("로그인 실패! 유저네임과 패스워드 확인필요.");
      }
    } catch (error) {
      if (error) {
        toast.error("로그인 실패! 에러발생!");
      }
    } finally {
      setLoading(false);
    }
  };

  //토큰이 있으면 홈페이지로 감(로그인 필요없음)
  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center">
      <React.Fragment>
        <form
          onSubmit={handleSubmit(onLoginHandler)}
          className="sm:w-[450px] w-[360px]  shadow-custom py-8 sm:px-8 px-4"
        >
          <div>
            <h1 className="font-montserrat text-center font-bold text-2xl">
              Login Here
            </h1>
            <p className="text-slate-600 text-center">
              Please Enter your username and password{" "}
            </p>
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
              message="*UserName is required"
              placeholder="type your username"
              register={register}
              errors={errors}
            />{" "}
            <InputField
              label="Password"
              required
              id="password"
              type="password"
              message="*Password is required"
              placeholder="type your password"
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
            {loading ? <span>Loading...</span> : "LogIn"}
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
      </React.Fragment>
    </div>
  );
};

export default Login;
