import React, { useEffect, useState } from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FaCaretDown } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const Comment = ({ comment, commentkey, index, userid, messageApi }) => {
  const [expandedComment, setExpandedComment] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isSeen, setIsSeen] = useState(false);

  const currentUserId = localStorage.getItem("userid");
  const token = localStorage.getItem("token");

  // File type function to determine the type of file (image, audio, or video)
  const fileType = () => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
    const audioExtensions = ["mp3"];
    const mediaExtensions = ["mp4"];

    const fileExtension = comment.fileloc.slice(-3).toLowerCase();
    const fileExtensionFull = comment.fileloc.slice(-4).toLowerCase();

    if (
      imageExtensions.includes(fileExtension) ||
      imageExtensions.includes(fileExtensionFull)
    ) {
      return "image";
    } else if (audioExtensions.includes(fileExtension)) {
      return "audio";
    } else if (mediaExtensions.includes(fileExtension)) {
      return "media";
    } else {
      return null;
    }
  };

  useEffect(() => {
    // Check if the comment has been viewed previously by the user
    const viewedComments = JSON.parse(localStorage.getItem("viewedComments")) || [];
    if (viewedComments.includes(commentkey)) {
      setIsSeen(true);
    }
  }, [commentkey]);

  const markAsViewed = async () => {
    try {
      const response = await fetch(`/api/form/markAsViewed/${commentkey}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error marking comment as viewed");

      // Mark as viewed in localStorage for persistence
      const viewedComments = JSON.parse(localStorage.getItem("viewedComments")) || [];
      if (!viewedComments.includes(commentkey)) {
        viewedComments.push(commentkey);
        localStorage.setItem("viewedComments", JSON.stringify(viewedComments));
      }

      setIsSeen(true); // Update state to reflect that the comment has been viewed
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/form/deleteComment/${commentkey}`, {
        method: "POST",
        body: JSON.stringify({ userid }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.json();
        messageApi.error(errorText.message);
        throw new Error("Error deleting comment");
      }
      messageApi.open({
        type: "loading",
        content: "Deleting Comment",
        duration: 0,
      });
      setTimeout(() => {
        messageApi.destroy();
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = async () => {
    try {
      const response = await fetch(`/api/form/getUser/${userid}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error fetching user");
      const data = await response.json();
      setUserEmail(data.email);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userid) {
      getUser();
    }
  }, [userid]);

  return (
    <a onClick={markAsViewed}>
      <div
        key={index}
        className="comment"
        style={{
          height: expandedComment && fileType() ? "280px" : "100px",
          border: isSeen ? "1px solid green" : "1px solid red", // Show border based on isSeen
        }}
      >
        <div className="profile">
          <Avatar size={35} icon={<UserOutlined />} />
          <p>{userEmail}</p>
        </div>
        <div className="commentCtn">
          <p>{comment.comment}</p>

          {/* Render Media based on File Type */}
          {fileType() === "image" && (
            <img
              src={comment.fileloc}
              alt=""
              style={{
                display: expandedComment ? "block" : "none",
                opacity: expandedComment ? "1" : 0,
              }}
            />
          )}

          {fileType() === "media" && (
            <video
              width="230"
              height="160"
              controls
              controlsList="nofullscreen nodownload noremoteplayback noplaybackrate"
              style={{
                display: expandedComment ? "block" : "none",
                opacity: expandedComment ? "1" : 0,
              }}
            >
              <source src={comment.fileloc} type="video/mp4"></source>
              Your browser does not support the media element.
            </video>
          )}

          {fileType() === "audio" && (
            <audio
              controls
              style={{
                display: expandedComment ? "block" : "none",
                opacity: expandedComment ? "1" : 0,
              }}
            >
              <source src={comment.fileloc} type="audio/mpeg"></source>
              Your browser does not support the audio element.
            </audio>
          )}
        </div>

        {/* Collapse/Expand Button */}
        {fileType() && (
          <FaCaretDown
            className="icondown"
            color="white"
            onClick={() => setExpandedComment(!expandedComment)}
          />
        )}

        {/* Delete Button */}
        <MdDeleteOutline
          color="white"
          onClick={handleDelete}
          size={18}
          style={{ cursor: "pointer" }}
        />
      </div>
    </a>
  );
};

export default Comment;
