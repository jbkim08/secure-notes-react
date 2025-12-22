import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import { Blocks } from "react-loader-spinner";
import Errors from "../Errors.js";
import moment from "moment";
import { Link } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { MdDateRange } from "react-icons/md";

//테이블 제목 : 데이터그리드 columns 에 넣으면 제목이 나옴
export const userListsColumns = [
  {
    field: "username",
    headerName: "UserName",
    minWidth: 200,
    headerAlign: "center",
    disableColumnMenu: true,
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal  border",
    renderHeader: (params) => <span className="text-center">유저네임</span>,
  },

  {
    field: "email",
    headerName: "Email",
    aligh: "center",
    width: 260,
    editable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal  border  text-center ",
    align: "center",
    disableColumnMenu: true,
    renderHeader: (params) => <span>이메일</span>,
    renderCell: (params) => {
      return (
        <div className=" flex  items-center justify-center  gap-1 ">
          <span>
            <MdOutlineEmail className="text-slate-700 text-lg" />
          </span>
          <span>{params?.row?.email}</span>
        </div>
      );
    },
  },
  {
    field: "created",
    headerName: "Created At",
    headerAlign: "center",
    width: 220,
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal  border  ",
    align: "center",
    disableColumnMenu: true,
    renderHeader: (params) => <span>가입일시</span>,
    renderCell: (params) => {
      return (
        <div className=" flex justify-center  items-center  gap-1 ">
          <span>
            <MdDateRange className="text-slate-700 text-lg" />
          </span>
          <span>{params?.row?.created}</span>
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    headerAlign: "center",
    align: "center",
    width: 200,
    editable: false,
    disableColumnMenu: true,
    headerClassName: "text-black font-semibold border ",
    cellClassName: "text-slate-700 font-normal  border  ",
    renderHeader: (params) => <span className="ps-10">상태</span>,
  },
  {
    field: "action",
    headerName: "Action",
    headerAlign: "center",
    editable: false,
    headerClassName: "text-black font-semibold text-cente",
    cellClassName: "text-slate-700 font-normal",
    sortable: false,
    width: 200,
    renderHeader: (params) => <span>유저보기</span>,
    renderCell: (params) => {
      return (
        <Link
          to={`/admin/users/${params.id}`}
          className="h-full flex  items-center justify-center   "
        >
          <button className="bg-btnColor text-white px-4 flex justify-center items-center  h-9 rounded-md ">
            Views
          </button>
        </Link>
      );
    },
  },
];

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/getusers");
        const usersData = Array.isArray(response.data) ? response.data : [];
        setUsers(usersData);
      } catch (err) {
        setError(err?.response?.data?.message);

        toast.error("Error fetching users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const rows = users.map((item) => {
    const formattedDate = moment(item.createdDate).format(
      "YYYY년, MMMM DD일, hh:mm A"
    );

    //실제 화면에 테이블 유저 데이터 날짜는 원하는 형식으로 바꿈
    return {
      id: item.userId,
      username: item.userName,
      email: item.email,
      created: formattedDate,
      status: item.enabled ? "Active" : "Inactive",
    };
  });

  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div className="p-4">
      <div className="py-4">
        <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">
          All Users
        </h1>
      </div>
      <div className="overflow-x-auto w-full mx-auto">
        {loading ? (
          <>
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
            {" "}
            <DataGrid
              className="w-fit mx-auto"
              rows={rows}
              columns={userListsColumns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 6,
                  },
                },
              }}
              disableRowSelectionOnClick
              pageSizeOptions={[6]}
              disableColumnResize
            />
          </>
        )}
      </div>
    </div>
  );
};

export default UserList;
