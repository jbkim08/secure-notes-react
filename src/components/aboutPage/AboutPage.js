import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
//import aboutImage from "./path/to/your/image.jpg"; // Add your image path here

const AboutPage = () => {
  return (
    <div className=" p-8   bg-gray-100 min-h-screen">
      <div className="md:w-1/2">
        <h1 className="text-4xl font-bold mb-4">회사 소개</h1>
        <p className="mb-4">
          SecureNote에 오신 것을 환영합니다. SecureNote는 안전하고 개인적인 메모
          작성을 위한 신뢰할 수 있는 동반자입니다. 저희는 여러분의 생각과
          아이디어가 최고 수준의 보안으로 보호되는 안전한 공간을 제공하는 것을
          목표로 합니다. 저희의 사명은 오직 사용자 본인만 메모에 접근할 수
          있도록 하여, 언제 어디서나 안전하게 메모를 사용할 수 있게 하는
          것입니다. SecureNote는 최첨단 암호화 기술과 사용자 친화적인 기능을
          통해 여러분의 정보를 기밀로 유지하고 안전하게 보호합니다.
        </p>

        <ul className="list-disc list-inside mb-4 text-sm px-6 py-2">
          <li className="mb-2">
            메모는 작성하는 순간부터 암호화되어 보호됩니다.
          </li>
          <li className="mb-2">
            어디서든 메모에 접근할 수 있으며, 안전하게 저장된다는 것을
            보장합니다.
          </li>
          <li className="mb-2">
            직관적이고 사용하기 쉬운 인터페이스로 설계되었습니다.
          </li>
        </ul>
        <div className="flex space-x-4 mt-10">
          <Link className="text-white rounded-full p-2 bg-customRed  " to="/">
            <FaFacebookF size={24} />
          </Link>
          <Link className="text-white rounded-full p-2 bg-customRed  " to="/">
            <FaTwitter size={24} />
          </Link>
          <Link className="text-white rounded-full p-2 bg-customRed  " to="/">
            <FaLinkedinIn size={24} />
          </Link>
          <Link className="text-white rounded-full p-2 bg-customRed  " to="/">
            <FaInstagram size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
