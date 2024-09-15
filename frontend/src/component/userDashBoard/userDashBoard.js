import React, { Fragment, useState, useRef } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector } from "react-redux";
import Loader from "../layout/loader/loader";
// import { useNavigate } from "react-router-dom";

import ProfilePng from "../../images/user.png";
import studentRegistration from "../../images/icons/studentRegistration.png";
import exStudentRegistration from "../../images/icons/exstudents.png";
import leftArrow from "../../images/icons/leftArrow.png";
import rightArrow from "../../images/icons/rightArrow.png";

import "./userDashBoard.css";
import StudentRegistration from "./studentRegistration";

function UserDashBoard() {
  const [activeItem, setActiveItem] = useState("list1");
  const [isThin, setIsThin] = useState(false);
  const { user, isLoading } = useSelector((state) => state.user);

  // Refs for arrow images
  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);

  // Array of items with their ids and display content
  const items = [
    { id: "list1",src: studentRegistration, title: "Student Registration", content: <StudentRegistration /> },
    { id: "list2",src: exStudentRegistration, title: "Ex-Student Registration", content: "" },
  ];

  if (isLoading) {
    return <Loader />;
  }

  const handleClick = (id) => {
    setActiveItem(id);
  };

  const handleClickArrow = (direction) => {
    setIsThin(direction === "leftArrow");

    if (leftArrowRef.current && rightArrowRef.current) {
      leftArrowRef.current.style.display = direction === "leftArrow" ? 'none' : 'block';
      rightArrowRef.current.style.display = direction === "rightArrow" ? 'none' : 'block';
    }
  };

  const handleMouseOver = () => {
    const listItems = document.querySelectorAll(".list");
    listItems.forEach((item) => {
      if (activeItem !== null) {
        item.classList.remove("active");
      }
    });
  };

  const handleMouseLeave = () => {
    const listItems = document.querySelectorAll(".list");
    listItems.forEach((item) => {
      if (activeItem !== null && item.id === activeItem) {
        item.classList.add("active");
      }
    });
  };

  return (
    <Fragment>
      <MetaData title={`${user.name}'s DashBoard`} />

      <section className="mainSection">
        <div className={`leftBox ${isThin ? 'thin' : ''}`}>
          <ul onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
            {items.map((item) => (
                <li
                  key={item.id}
                  className={`list ${activeItem === item.id ? "active" : ""}`}
                  id={item.id}
                  onClick={() => handleClick(item.id)}
                >
                  <img
                    src={item.src}
                    alt={item.title+"Icon"}
                    className="icon"
                  />
                  <p>{item.title}</p>
                </li>
            ))}
          </ul>
        </div>
        <div className={`rightBox ${isThin ? 'fat' : ''}`}>
          <div className="container firstRow">
            <div className="left">
              <img
                ref={leftArrowRef}
                onClick={() => handleClickArrow("leftArrow")}
                src={leftArrow}
                alt="leftArrow"
                className="arrowIcon"
              />
              <img
                ref={rightArrowRef}
                onClick={() => handleClickArrow("rightArrow")}
                style={{ display: "none" }}
                src={rightArrow}
                alt="rightArrow"
                className="arrowIcon"
              />
            </div>
            <div className="middle">
              <h1>Hello {user.name}</h1>
            </div>
            <div className="right">
              <img
                src={user.avatar.url || ProfilePng}
                alt="user avatar"
                className="userIcon"
              />
            </div>
          </div>
          <div className="container mainDiv">
            {/* Display content of the active item */}
            {items.find((item) => item.id === activeItem)?.content ||
              "Please select an item from the list."}
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default UserDashBoard;
