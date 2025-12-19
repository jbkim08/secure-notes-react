import { MdRemoveRedEye } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import { truncateText } from "../../utils/truncateText";
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import "moment/locale/ko"; // 한국어 로케일 추가

//한개의 노트를 화면에 표시
const NoteItems = ({ parsedContent, id, createdAt }) => {
  moment.locale("ko");
  const formattedDate = moment(createdAt).format("YYYY MMMM Do, h:mm:ss");
  return (
    <div className="sm:px-5 px-2 py-5 shadow-md bg-noteColor shadow-white rounded-lg min-h-96 max-h-96 relative overflow-hidden ">
      <p
        className="text-black font-customWeight ql-editor"
        dangerouslySetInnerHTML={{ __html: truncateText(parsedContent) }}
      ></p>
      <div className="flex justify-between items-center  absolute bottom-5 sm:px-5 px-2 left-0 w-full text-slate-700">
        <span>{formattedDate}</span>
        <Link to={`/notes/${id}`}>
          {" "}
          <Tooltip title="노트 보기">
            <IconButton>
              <MdRemoveRedEye className="text-slate-700" />
            </IconButton>
          </Tooltip>
        </Link>
      </div>
    </div>
  );
};

export default NoteItems;
