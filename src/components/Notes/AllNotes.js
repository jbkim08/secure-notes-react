import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import NoteItems from "./NoteItems";
import { FiFilePlus } from "react-icons/fi";
import { Blocks } from "react-loader-spinner";
import Errors from "../Errors";
// 내가 쓴 노트 페이지
const AllNotes = () => {
  const [notes, setNotes] = useState([]); //노트 배열
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  //백엔드에서 내가 쓴 노트들을 가져오는 함수
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/notes"); //백엔드에서 내가쓴 노트들을 받음
      console.log(response);
      const parsedNotes = response.data.map((note) => ({
        ...note,
        parsedContent: JSON.parse(note.content).content, //문자열을 풀어서 컨텐트 내용만 입력
      }));
      setNotes(parsedNotes);
    } catch (error) {
      setError(error.response.data.message);
      console.error("노트가져오기 에러 발생", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //처음 한번만 가져옴
    fetchNotes();
  }, []);

  //에러 발생시 화면에 바로 에러메세지 표시
  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div className="min-h-[calc(100vh-74px)] sm:py-10 sm:px-5 px-0 py-4">
      <div className="w-[92%] mx-auto ">
        {!loading && notes && notes?.length > 0 && (
          <h1 className="font-montserrat  text-slate-800 sm:text-4xl text-2xl font-semibold ">
            My Notes
          </h1>
        )}
        {loading ? (
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
        ) : (
          <>
            {notes && notes?.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-96  p-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    아직 쓴 글이 하나도 없네요.
                  </h2>
                  <p className="text-gray-600 mb-6">새 글을 작성해 보세요!</p>
                  <div className="w-full flex justify-center">
                    <Link to="/create-note">
                      <button className="flex items-center px-4 py-2 bg-btnColor text-white rounded  focus:outline-none focus:ring-2 focus:ring-blue-300">
                        <FiFilePlus className="mr-2" size={24} />새 노트 작성
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="pt-10 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-y-10 gap-x-5 justify-center">
                  {notes.map((item) => (
                    <NoteItems key={item.id} {...item} id={item.id} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllNotes;
