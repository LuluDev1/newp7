import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CiCirclePlus } from "react-icons/ci";
import "../styles/Home.scss";
import { message, Avatar } from "antd";
import Comment from "../components/Comment";
import { UserOutlined } from "@ant-design/icons";
import { IoMdMenu } from "react-icons/io";
import image from "../assets/icon-left-font-monochrome-white.webp";

import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [comments, setComments] = useState([]);

  const [toggleNav, settoggleNav] = useState(false);
  const token = localStorage.getItem("token");
  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    const formData = new FormData();
    formData.append("file", data.file[0]);
    formData.append("textarea", data.textarea);
    formData.append("email", email);

    try {
      const response = await fetch("/api/form/addComment", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        reset();
        messageApi.open({
          type: "success",
          content: "Added comment!",
        });
        setTimeout(() => {
          messageApi.destroy;
        }, 100);
        getAllComments();
      } else {
        throw new Error("Network Error: " + response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const getAllComments = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/form/getAllComments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Error fetching comments");
      }

      const data = await response.json();

      setComments(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const logOut = async () => {
    settoggleNav(false);
    messageApi.open({
      type: "loading",
      content: "Logging Out",
      duration: 0,
    });
    setTimeout(() => {
      messageApi.destroy;
      localStorage.removeItem("token");
      navigate("/login");
    }, 1500);
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch("/api/form/deleteUser", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        messageApi.error("Error Deleting Acount");
        throw new Error(response.message);
      }
      messageApi.open({
        type: "loading",
        content: "Byyyeeee",
        duration: 0,
      });
      setTimeout(() => {
        messageApi.destroy;
        localStorage.removeItem("token");
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllComments();
  }, []);

  return (
    <>
      {contextHolder}
      <div className="homePage">
        <IoMdMenu
          className="menu"
          size={23}
          color="white"
          onClick={() => {
            settoggleNav(!toggleNav);
          }}
        />
        <nav
          style={{
            width: toggleNav ? "350px" : "0",
            height: toggleNav ? "100px" : "0",
            opacity: toggleNav ? "1" : "0",
            display: toggleNav ? "block" : "none",
          }}
        >
          <ul>
            <li>
              <a onClick={() => deleteAccount()}>Delete Account</a>
            </li>
            <li>
              <a
                onClick={() => {
                  logOut();
                }}
              >
                Log OUt
              </a>
            </li>
          </ul>
        </nav>
        <div className="content">
          <img src={image} alt="App Logo" className="app_logo" />
          <div className="searchbar">
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
            >
              <button type="submit">
                <CiCirclePlus size={24} className="searchIcon" />
              </button>
              <div className="inputs">
                <input
                  type="file"
                  {...register("file")}
                  accept="image/*,video/*,audio/*"
                  placeholder="HE"
                />
                <textarea
                  {...register("textarea")}
                  placeholder="Share Today"
                  required
                  autoFocus
                  minLength={3}
                />
              </div>
            </form>
          </div>
          <div className="comments">
            {comments.map((comment, index) => (
              <Comment
                commentkey={comment.id}
                comment={comment}
                userid={comment.userid}
                index={index}
                messageApi={messageApi}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
