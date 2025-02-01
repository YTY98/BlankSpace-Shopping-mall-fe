import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceGrinSquint,
  faFaceGrinWide,
  faFaceGrinWink,
  faFaceMehBlank,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";

const MembershipIcon = ({ membership }) => {
  if (membership === "bronze") {
    return (
      <FontAwesomeIcon
        icon={faFaceMehBlank}
        size="2x"
        style={{ color: "#643521" }}
      />
    );
  } else if (membership === "silver") {
    return (
      <FontAwesomeIcon
        icon={faFaceSmile}
        size="2x"
        style={{ color: "#A0B5BA" }}
      />
    );
  } else if (membership === "gold") {
    return (
      <FontAwesomeIcon
        icon={faFaceGrinWide}
        size="2x"
        style={{ color: "#DC9F3E" }}
      />
    );
  } else if (membership === "platinum") {
    return (
      <FontAwesomeIcon
        icon={faFaceGrinWink}
        size="2x"
        style={{ color: "#37e895" }}
      />
    );
  } else if (membership === "diamond") {
    return (
      <FontAwesomeIcon
        icon={faFaceGrinSquint}
        size="2x"
        style={{ color: "#3de5e5" }}
      />
    );
  }

  return (
    <FontAwesomeIcon
      icon={faFaceMehBlank}
      size="2x"
      style={{ color: "#643521" }}
    />
  );
};

export default MembershipIcon;
