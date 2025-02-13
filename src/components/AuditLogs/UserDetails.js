import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import InputField from "../InputField/InputField";
import { Blocks } from "react-loader-spinner";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";
import Errors from "../Errors";

//관리자 액션버튼 클릭시 => 유저디테일 페이지
const UserDetails = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const [loading, setLoading] = useState(false);
  const [updateRoleLoader, setUpdateRoleLoader] = useState(false);
  const [passwordLoader, setPasswordLoader] = useState(false);

  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState(null);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  //유저 정보를 가져옴
  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/user/${userId}`);
      setUser(response.data);

      setSelectedRole(response.data.role?.roleName || "");
    } catch (err) {
      setError(err?.response?.data?.message);
      console.error("유저 정보가져오기 에러", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // react-hook-form 에 유저이름과 이메일을 업데이트
    if (user && Object.keys(user).length > 0) {
      setValue("username", user.userName);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await api.get("/admin/roles");
      setRoles(response.data);
    } catch (err) {
      setError(err?.response?.data?.message);
      console.error("권한을 가져오기 에러", err);
    }
  }, []);

  //처음 시작시 유저정보와 권한정보를 가져옴
  useEffect(() => {
    fetchUserDetails();
    fetchRoles();
  }, [fetchUserDetails, fetchRoles]);

  //현재 선택한 권한 업데이트
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  //권한을 서버에 업데이트
  const handleUpdateRole = async () => {
    setUpdateRoleLoader(true);
    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append("roleName", selectedRole);

      await api.put(`/admin/update-role`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      fetchUserDetails();
      toast.success("권한 업데이트 성공");
    } catch (err) {
      console.log(err);
      toast.error("권한 업데이트 실패");
    } finally {
      setUpdateRoleLoader(false);
    }
  };

  //패스워드 업데이트
  const handleSavePassword = async (data) => {
    setPasswordLoader(true);
    const newPassword = data.password;

    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append("password", newPassword);

      await api.put(`/admin/update-password`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      setIsEditingPassword(false);
      setValue("password", "");
      //fetchUserDetails();
      toast.success("패스워드 업데이트 성공");
    } catch (err) {
      toast.error("패스워드 업데이트 에러 : " + err.response.data);
    } finally {
      setPasswordLoader(false);
    }
  };

  const handleCheckboxChange = async (e, updateUrl) => {
    const { name, checked } = e.target;

    let message = null;
    if (name === "lock") {
      message = "Update Account Lock status Successful";
    } else if (name === "expire") {
      message = "Update Account Expiry status Successful";
    } else if (name === "enabled") {
      message = "Update Account Enabled status Successful";
    } else if (name === "credentialsExpire") {
      message = "Update Account Credentials Expired status Successful";
    }

    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);

      formData.append(name, checked);

      await api.put(updateUrl, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      fetchUserDetails();
      toast.success(message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.log(`Error updating ${name}:`);
    } finally {
      message = null;
    }
  };

  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div className="sm:px-12 px-4 py-10   ">
      {loading ? (
        <>
          {" "}
          <div className="flex  flex-col justify-center items-center  h-72">
            <span>
              <Blocks
                height="70"
                width="70"
                color="#4fa94d"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                visible={true}
              />
            </span>
            <span>Please wait...</span>
          </div>
        </>
      ) : (
        <>
          <div className="lg:w-[70%] sm:w-[90%] w-full  mx-auto shadow-lg shadow-gray-300 p-8 rounded-md">
            <div>
              <h1 className="text-slate-800 text-2xl font-bold  pb-4">
                유저 프로파일
                <hr />
              </h1>
              <form
                className="flex  flex-col  gap-2  "
                onSubmit={handleSubmit(handleSavePassword)}
              >
                <InputField
                  label="유저네임"
                  required
                  id="username"
                  className="w-full"
                  type="text"
                  message="*UserName is required"
                  placeholder="Enter your UserName"
                  register={register}
                  errors={errors}
                  readOnly
                />
                <InputField
                  label="이메일"
                  required
                  id="email"
                  className="flex-1"
                  type="text"
                  message="*Email is required"
                  placeholder="Enter your Email"
                  register={register}
                  errors={errors}
                  readOnly
                />
                <InputField
                  label="패스워드"
                  required
                  autoFocus={isEditingPassword}
                  id="password"
                  className="w-full"
                  type="password"
                  message="*Password is required"
                  placeholder="Enter your Password"
                  register={register}
                  errors={errors}
                  readOnly={!isEditingPassword}
                  min={6}
                />{" "}
                {!isEditingPassword ? (
                  <Buttons
                    type="button"
                    onClickhandler={() =>
                      setIsEditingPassword(!isEditingPassword)
                    }
                    className="bg-customRed mb-0 w-fit px-4 py-2 rounded-md text-white"
                  >
                    패스워드 업데이트
                  </Buttons>
                ) : (
                  <div className="flex items-center gap-2 ">
                    <Buttons
                      type="submit"
                      className="bg-btnColor mb-0 w-fit px-4 py-2 rounded-md text-white"
                    >
                      {passwordLoader ? "로딩중.." : "저장"}
                    </Buttons>
                    <Buttons
                      type="button"
                      onClickhandler={() =>
                        setIsEditingPassword(!isEditingPassword)
                      }
                      className="bg-customRed mb-0 w-fit px-4 py-2 rounded-md text-white"
                    >
                      취소
                    </Buttons>
                  </div>
                )}
              </form>
            </div>
          </div>
          {/* 관리자 액션 */}
          <div className="lg:w-[70%] sm:w-[90%] w-full  mx-auto shadow-lg shadow-gray-300 p-8 rounded-md">
            <h1 className="text-slate-800 text-2xl font-bold  pb-4">
              관리자 액션
              <hr />
            </h1>

            <div className="py-4 flex sm:flex-row flex-col sm:items-center items-start gap-4">
              <div className="flex items-center gap-2">
                <label className="text-slate-600 text-lg font-semibold ">
                  권한:{" "}
                </label>
                <select
                  className=" px-8 py-1 rounded-md  border-2 uppercase border-slate-600  "
                  value={selectedRole}
                  onChange={handleRoleChange}
                >
                  {roles.map((role) => (
                    <option
                      className="bg-slate-200 flex flex-col gap-4 uppercase text-slate-700"
                      key={role.roleId}
                      value={role.roleName}
                    >
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="bg-btnColor hover:text-slate-300 px-4 py-2 rounded-md text-white "
                onClick={handleUpdateRole}
              >
                {updateRoleLoader ? "로딩중..." : "권한업데이트"}
              </button>
            </div>

            <hr className="py-2" />
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-2">
                <label className="text-slate-600 text-sm font-semibold uppercase">
                  {" "}
                  Lock Account
                </label>
                <input
                  className="text-14 w-5 h-5"
                  type="checkbox"
                  name="lock"
                  checked={!user?.accountNonLocked}
                  onChange={(e) =>
                    handleCheckboxChange(e, "/admin/update-lock-status")
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-slate-600 text-sm font-semibold uppercase">
                  {" "}
                  Account Expiry
                </label>
                <input
                  className="text-14 w-5 h-5"
                  type="checkbox"
                  name="expire"
                  checked={!user?.accountNonExpired}
                  onChange={(e) =>
                    handleCheckboxChange(e, "/admin/update-expiry-status")
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-slate-600 text-sm font-semibold uppercase">
                  {" "}
                  Account Enabled
                </label>
                <input
                  className="text-14 w-5 h-5"
                  type="checkbox"
                  name="enabled"
                  checked={user?.enabled}
                  onChange={(e) =>
                    handleCheckboxChange(e, "/admin/update-enabled-status")
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-slate-600 text-sm font-semibold uppercase">
                  {" "}
                  Credentials Expired
                </label>
                <input
                  className="text-14 w-5 h-5"
                  type="checkbox"
                  name="credentialsExpire"
                  checked={!user?.credentialsNonExpired}
                  onChange={(e) =>
                    handleCheckboxChange(
                      e,
                      `/admin/update-credentials-expiry-status?userId=${userId}&expire=${user?.credentialsNonExpired}`
                    )
                  }
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetails;
