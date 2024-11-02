import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  }, []);
  return null;
};

export default Welcome;
