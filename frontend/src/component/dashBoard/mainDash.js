import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";

import ProfilePng from "../../images/user.png"
import createBatchIcon from "../../images/icons/createBatch.png";
import leftArrow from "../../images/icons/leftArrow.png";

import "./mainDash.css";

function MainDashBoard() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("");
  const { user, isLoading } = useSelector((state) => state.user);

  // Use useEffect to log activeItem whenever it updates
  useEffect(() => {
  }, [activeItem]);

  if (isLoading) {
    return <Loader />;
  }

  const handleClick = (e) => {
    const clickedItemId = e.currentTarget.id; 
    setActiveItem(clickedItemId); 
    const listItems = document.querySelectorAll(".list");

    const listArray = Array.from(listItems);
    listArray.forEach((item) => {
        if (item.id === clickedItemId) {
          // Add class to the hovered item
          item.classList.add("active");
        } else {
          // Remove class from non-hovered items
          item.classList.remove("active");
        }
      });
  };
  
  const handleMouseOver = (e) => { 
    const listItems = document.querySelectorAll(".list");

    const listArray = Array.from(listItems);
    listArray.forEach((item) => {
        if (activeItem !== "") {
          // Add class to the hovered item
          item.classList.remove("active");
        } 
      });
  };
  const handleMouseLeave = (e) => {
    const listItems = document.querySelectorAll(".list");

    const listArray = Array.from(listItems);
    listArray.forEach((item) => {
        if (activeItem !== "" && item.id === activeItem) {
          item.classList.add("active");
        } 
      });
  };

  return (
    <Fragment>
      <MetaData title={`${user.name}'s DashBoard`} />

      <section className="mainSection">
        <div className="leftBox">
          <ul onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
            {[...Array(7).keys()].map((i) => (
              <li
                key={i}
                className={`list ${activeItem === `list${i + 1}` ? "active" : ""}`} // Add 'active' class for the clicked item
                id={`list${i + 1}`}
                onClick={handleClick}
              >
                <img
                  src={createBatchIcon}
                  alt="createBatchIcon"
                  className="icon"
                />
                <p>Create Batch</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rightBox">
          <div className="container firstRow">
            <div className="left">
              <img src={leftArrow} alt="leftArrow" className="icon" />
            </div>
            <div className="middle">
              <h1>Hello {user.name}</h1>
            </div>
            <div className="right">
              <img
                src={user.avatar.url || ProfilePng}
                alt="user avatar"
                className="icon"
              />
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default MainDashBoard;
