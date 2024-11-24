import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfoCard from "./component/InfoCard";
import "./style/infoCard.style.css";

const MyPage = () => {

  
  return (
    <div className="infoBox">
      <InfoCard />
    </div>
  );
};

export default MyPage;