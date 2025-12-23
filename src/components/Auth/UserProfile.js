import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useMyContext } from "../../store/ContextApi";
import Avatar from "@mui/material/Avatar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InputField from "../InputField/InputField";
import { useForm } from "react-hook-form";
import Buttons from "../../utils/Buttons";
import Switch from "@mui/material/Switch";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Blocks } from "react-loader-spinner";
import moment from "moment";
import Errors from "../Errors";

const UserProfile = () => {
  // useMyContext()로 전역상태값을 가져옴
  const { currentUser, token } = useMyContext();
  //set the loggin session from the token
  const [loginSession, setLoginSession] = useState(null);

  const [credentialExpireDate, setCredentialExpireDate] = useState(null);
  const [pageError, setPageError] = useState(false);

  const [accountExpired, setAccountExpired] = useState();
  const [accountLocked, setAccountLock] = useState();
  const [accountEnabled, setAccountEnabled] = useState();
  const [credentialExpired, setCredentialExpired] = useState();

  const [openAccount, setOpenAccount] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  //로딩 상태
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,

    formState: { errors },
  } = useForm({
    defaultValues: {
      username: currentUser?.username,
      email: currentUser?.email,
      password: "",
    },
    mode: "onTouched",
  });

  //비밀번호 업데이트
  const handleUpdateCredential = async (data) => {
    const newUsername = data.username;
    const newPassword = data.password;

    try {
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("newUsername", newUsername);
      formData.append("newPassword", newPassword);
      await api.post("/auth/update-credentials", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //fetchUser();
      toast.success("비밀번호 업데이트 완료!");
    } catch (error) {
      toast.error("업데이트 실패!");
    } finally {
      setLoading(false);
    }
  };

  //유저정보 업데이트
  useEffect(() => {
    if (currentUser?.id) {
      setValue("username", currentUser.username);
      setValue("email", currentUser.email);
      setAccountExpired(!currentUser.accountNonExpired);
      setAccountLock(!currentUser.accountNonLocked);
      setAccountEnabled(currentUser.enabled);
      setCredentialExpired(!currentUser.credentialsNonExpired);

      const expiredFormatDate = moment(
        currentUser?.credentialsExpiryDate
      ).format("YYYY년 MMMM D일");
      setCredentialExpireDate(expiredFormatDate);
    }
  }, [currentUser, setValue]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);

      const lastLoginSession = moment
        .unix(decodedToken.iat)
        .format("YYYY년 MMMM D일 dddd h:mm A");
      //로그인 일시
      setLoginSession(lastLoginSession);
    }
  }, [token]);

  //계정 상태 업데이트
  const handleAccountExpiryStatus = async (event) => {
    setAccountExpired(event.target.checked);

    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("expire", event.target.checked);

      await api.put("/auth/update-expiry-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      toast.success("계정 만료 업데이트");
    } catch (error) {
      toast.error("업데이트 실패!");
    } finally {
      setLoading(false);
    }
  };

  //update the AccountLockStatus
  const handleAccountLockStatus = async (event) => {
    setAccountLock(event.target.checked);

    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("lock", event.target.checked);

      await api.put("/auth/update-lock-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      toast.success("계정 잠금 업데이트");
    } catch (error) {
      toast.error("업데이트 실패!");
    } finally {
      setLoading(false);
    }
  };

  //계정상태 업데이트
  const handleAccountEnabledStatus = async (event) => {
    setAccountEnabled(event.target.checked);
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("enabled", event.target.checked);

      await api.put("/auth/update-enabled-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      toast.success("계정 상태 업데이트");
    } catch (error) {
      toast.error("업데이트 실패!");
    } finally {
      setLoading(false);
    }
  };

  //비밀번호 만료 업데이트
  const handleCredentialExpiredStatus = async (event) => {
    setCredentialExpired(event.target.checked);
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("expire", event.target.checked);

      await api.put("/auth/update-credentials-expiry-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //fetchUser();
      toast.success("비번 만료 업데이트");
    } catch (error) {
      toast.error("업데이트 실패!");
    } finally {
      setLoading(false);
    }
  };

  if (pageError) {
    return <Errors message={pageError} />;
  }

  const onOpenAccountHandler = () => {
    setOpenAccount(!openAccount);
    setOpenSetting(false);
  };

  const onOpenSettingHandler = () => {
    setOpenSetting(!openSetting);
    setOpenAccount(false);
  };

  return (
    <div className="min-h-[calc(100vh-74px)] p-10">
      <div className="xl:w-[30%] lg:w-[40%] sm:w-[90%] w-full sm:mx-auto sm:px-0 px-4   min-h-[500px] flex lg:flex-row flex-col gap-4 ">
        <div className="flex-1  flex flex-col shadow-lg shadow-gray-300 gap-2 px-4 py-6">
          <div className="flex flex-col items-center gap-2   ">
            <Avatar
              alt={currentUser?.username}
              src="/static/images/avatar/1.jpg"
            />
            <h3 className="font-semibold text-2xl">{currentUser?.username}</h3>
          </div>
          <div className="my-4 ">
            <div className="space-y-2 px-4 mb-1">
              <h1 className="font-semibold text-md text-slate-800">
                UserName :{" "}
                <span className=" text-slate-700  font-normal">
                  {currentUser?.username}
                </span>
              </h1>
              <h1 className="font-semibold text-md text-slate-800">
                Role :{" "}
                <span className=" text-slate-700  font-normal">
                  {currentUser && currentUser["roles"][0]}
                </span>
              </h1>
            </div>
            <div className="py-3">
              <Accordion expanded={openAccount}>
                <AccordionSummary
                  className="shadow-md shadow-gray-300"
                  onClick={onOpenAccountHandler}
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <h3 className="text-slate-800 text-lg font-semibold ">
                    Update User Credentials
                  </h3>
                </AccordionSummary>
                <AccordionDetails className="shadow-md shadow-gray-300">
                  <form
                    className=" flex flex-col gap-3"
                    onSubmit={handleSubmit(handleUpdateCredential)}
                  >
                    <InputField
                      label="UserName"
                      required
                      id="username"
                      className="text-sm"
                      type="text"
                      message="*Username is required"
                      placeholder="Enter your username"
                      register={register}
                      errors={errors}
                    />{" "}
                    <InputField
                      label="Email"
                      required
                      id="email"
                      className="text-sm"
                      type="email"
                      message="*Email is required"
                      placeholder="Enter your email"
                      register={register}
                      errors={errors}
                      readOnly
                    />{" "}
                    <InputField
                      label="Enter New Password"
                      id="password"
                      className="text-sm"
                      type="password"
                      message="*Password is required"
                      placeholder="type your password"
                      register={register}
                      errors={errors}
                      min={6}
                    />
                    <Buttons
                      disabled={loading}
                      className="bg-customRed font-semibold flex justify-center text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3"
                      type="submit"
                    >
                      {loading ? <span>Loading...</span> : "Update"}
                    </Buttons>
                  </form>
                </AccordionDetails>
              </Accordion>
              <div className="mt-6">
                <Accordion expanded={openSetting}>
                  <AccordionSummary
                    className="shadow-md shadow-gray-300"
                    onClick={onOpenSettingHandler}
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <h3 className="text-slate-800 text-lg font-semibold">
                      Account Setting
                    </h3>
                  </AccordionSummary>
                  <AccordionDetails className="shadow-md shadow-gray-300">
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="text-slate-700 font-customWeight text-sm ">
                          Account Expired
                        </h3>
                        <Switch
                          checked={accountExpired}
                          onChange={handleAccountExpiryStatus}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </div>{" "}
                      <div>
                        <h3 className="text-slate-700 font-customWeight text-sm ">
                          Account Locked
                        </h3>
                        <Switch
                          checked={accountLocked}
                          onChange={handleAccountLockStatus}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </div>{" "}
                      <div>
                        <h3 className="text-slate-700 font-customWeight text-sm ">
                          Account Enabled
                        </h3>
                        <Switch
                          checked={accountEnabled}
                          onChange={handleAccountEnabledStatus}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </div>
                      <>
                        <div className="mb-2">
                          <h3 className="text-slate-700 font-customWeight text-sm ">
                            Credential Setting
                          </h3>
                          <div className="shadow-gray-300 shadow-md px-4 py-4 rounded-md">
                            <p className="text-slate-700  text-sm ">
                              Your credential will expired{" "}
                              <span>{credentialExpireDate}</span>
                            </p>
                          </div>
                        </div>
                      </>
                      <div>
                        <h3 className="text-slate-700 font-customWeight text-sm">
                          Credential Expired
                        </h3>
                        <Switch
                          checked={credentialExpired}
                          onChange={handleCredentialExpiredStatus}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>

              <div className="pt-10 ">
                <h3 className="text-slate-800 text-lg font-semibold  mb-2 px-2">
                  Last Login Session
                </h3>
                <div className="shadow-md shadow-gray-300 px-4 py-2 rounded-md">
                  <p className="text-slate-700 text-sm">
                    Your Last LogIn Session when you are loggedin <br />
                    <span>{loginSession}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
