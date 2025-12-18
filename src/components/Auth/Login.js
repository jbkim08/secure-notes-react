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
  // Step 1: Login method and Step 2: Verify 2FA
  const [step, setStep] = useState(1);
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  // Access the token and setToken function using the useMyContext hook from the ContextProvider
  const { setToken, token } = useMyContext();
  const navigate = useNavigate();

  //react hook form initialization
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

  //if there is token  exist navigate  the user to the home page if he tried to access the login page
  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  //step1 will render the login form and step-2 will render the 2fa verification form
  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center">
      {step === 1 ? (
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
              <Link
                className=" underline hover:text-black"
                to="/forgot-password"
              >
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
      ) : null}
    </div>
  );
};

export default Login;
