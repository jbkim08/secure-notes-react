import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Divider from "@mui/material/Divider";
import Buttons from "../../utils/Buttons";
import InputField from "../InputField/InputField";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import { useEffect } from "react";

//가입하기 페이지
const Signup = () => {
  const apiUrl = process.env.REACT_APP_API_URL; //백엔드 기본주소
  const [role, setRole] = useState(); //유저의 권한
  const [loading, setLoading] = useState(false);
  const { token } = useMyContext(); // 컨텍스트에서 토큰가져오기
  const navigate = useNavigate(); // 이동객체

  //react hook form 설정
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    setRole("ROLE_USER");
  }, []);

  //가입하기 실행 함수
  const onSubmitHandler = async (data) => {
    const { username, email, password } = data;
    const sendData = {
      username,
      email,
      password,
      role: [role], //기본 유저롤
    };

    try {
      setLoading(true);
      //백엔드에 가입하기 url로 요청함
      const response = await api.post("/auth/public/signup", sendData);
      toast.success("가입하기 성공!");
      reset();
      if (response.data) {
        navigate("/login"); //로그인 페이지로
      }
    } catch (error) {
      if (
        error?.response?.data?.message === "Error: 유저네임이 이미 있습니다!"
      ) {
        setError("username", { message: "유저네임이 이미 있습니다" });
      } else if (
        error?.response?.data?.message === "Error: 이메일이 이미 있습니다!"
      ) {
        setError("email", { message: "이메일이 이미 있습니다!" });
      }
    } finally {
      setLoading(false);
    }
  };

  //토큰인증이 된경우에는 기본페이지로
  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="sm:w-[450px] w-[360px]  shadow-custom py-6 sm:px-8 px-4"
      >
        <div>
          <h1 className="font-montserrat text-center font-bold text-3xl">
            가입하기
          </h1>

          <div className="flex items-center justify-between gap-1 py-5 ">
            <a
              href={`${apiUrl}/oauth2/authorization/google`}
              className="flex gap-1 items-center justify-center flex-1 border p-2 shadow-sm shadow-slate-200 rounded-md hover:bg-slate-300 transition-all duration-300"
            >
              <span>
                <FcGoogle className="text-2xl" />
              </span>
              <span className="font-semibold sm:text-customText text-xs">
                Login with Google
              </span>
            </a>
            <a
              href={`${apiUrl}/oauth2/authorization/github`}
              className="flex gap-1 items-center justify-center flex-1 border p-2 shadow-sm shadow-slate-200 rounded-md hover:bg-slate-300 transition-all duration-300"
            >
              <span>
                <FaGithub className="text-2xl" />
              </span>
              <span className="font-semibold sm:text-customText text-xs">
                Login with Github
              </span>
            </a>
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
            label="Email"
            required
            id="email"
            type="email"
            message="이메일이 필요합니다"
            placeholder="이메일 입력..."
            register={register}
            errors={errors}
          />
          <InputField
            label="Password"
            required
            id="password"
            type="password"
            message="패스워드가 필요합니다"
            placeholder="패스워드 입력..."
            register={register}
            errors={errors}
            min={6}
          />
        </div>
        <Buttons
          disabled={loading}
          onClickhandler={() => {}}
          className="bg-customRed font-semibold flex justify-center text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3"
          type="text"
        >
          {loading ? <span>Loading...</span> : "Register"}
        </Buttons>

        <p className="text-center text-sm text-slate-700 mt-2">
          Already have an account?{" "}
          <Link
            className="font-semibold underline hover:text-black"
            to="/login"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
