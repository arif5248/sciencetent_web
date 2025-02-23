import React, { Fragment, useState, useRef, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/loader/loader";

import ProfilePng from "../../images/user.png";
import studentRegistration from "../../images/icons/studentRegistration.png";
import exStudentRegistration from "../../images/icons/exstudents.png";
import leftArrow from "../../images/icons/leftArrow.png";
import rightArrow from "../../images/icons/rightArrow.png";
import exam from "../../images/icons/exam.png";
import batch from "../../images/icons/createBatch.png";

import "./userDashBoard.css";
import StudentRegistration from "./studentRegistration";
import { fetchAllPermissions } from "../../slice/permissionSlice";
import Batch from "../dashBoard/batch";
import Exam from "../dashBoard/exam";
import ExStudentRegistration from "./exStudentRegistration";

function UserDashBoard() {
  const dispatch = useDispatch();
  const [permissionsList, setPermissionsList] = useState([]);
  const [activeItem, setActiveItem] = useState("list1");
  const [isThin, setIsThin] = useState(false);
  const [dynamicItems, setDynamicItems] = useState([
    { id: "list1", src: studentRegistration, title: "Student Registration", content: <StudentRegistration /> },
    { id: "list2", src: exStudentRegistration, title: "Ex-Student Registration", content: <ExStudentRegistration/> },
  ]);

  const { user, isLoading } = useSelector((state) => state.user);
  const isStudent = user.studentRef;

  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllPermissions())
      .unwrap()
      .then((res) => {
        setPermissionsList(res.permissions || []);
      })
      .catch((err) => console.error("Error fetching permissions:", err));
  }, [dispatch]);
  
  useEffect(() => {
    if (permissionsList.length > 0) {
      const filteredPermission = permissionsList.filter((permission) =>
        user.permissions.some((item) => item === permission._id)
      );
  
      const dashItems = Array.from(
        new Set(
          filteredPermission.map((permission) => permission.permissionCode.charAt(0))
        )
      ).map((code) => {
        switch (code) {
          case "1":
            return { id: `dList${code}`, src: batch, title: "Batch", content: <Batch /> };
          case "4":
            return { id: `dList${code}`, src: exam, title: "Exam", content: <Exam /> };
          default:
            return null;
        }
      });
  
      setDynamicItems((prevItems) => [
        ...prevItems.filter((item) => item.id.startsWith("list")),
        ...dashItems.filter((item) => item !== null),
      ]);
    }
  }, [permissionsList, user.permissions]);
  

  const filteredItems = dynamicItems.filter(
    (item) => !((item.id === "list2" || item.id === "list1") && isStudent)
  );

  if (isLoading) {
    return <Loader />;
  }

  const handleClick = (id) => {
    setActiveItem(id);
  };

  const handleClickArrow = (direction) => {
    setIsThin(direction === "leftArrow");

    if (leftArrowRef.current && rightArrowRef.current) {
      leftArrowRef.current.style.display = direction === "leftArrow" ? "none" : "block";
      rightArrowRef.current.style.display = direction === "rightArrow" ? "none" : "block";
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
        <div className={`leftBox ${isThin ? "thin" : ""}`}>
          <ul onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className={`list ${activeItem === item.id ? "active" : ""}`}
                id={item.id}
                onClick={() => handleClick(item.id)}
              >
                <img src={item.src} alt={`${item.title} Icon`} className="icon" />
                <p>{item.title}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className={`rightBox ${isThin ? "fat" : ""}`}>
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
            {filteredItems.find((item) => item.id === activeItem)?.content ||
              "Please select an item from the list."}
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default UserDashBoard;
