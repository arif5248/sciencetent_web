import React, { Fragment, useState } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";

// import ProfilePng from "../../images/user.png";
import createBatchIcon from "../../images/icons/createBatch.png";
// import leftArrow from "../../images/icons/leftArrow.png";

import "./student.css";
import AllPendingStudents from "../student/getPendingStudents";

function Student() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("btn1");
  const { user, isLoading } = useSelector((state) => state.user);

  const allButtons = [
    { id: "btn1", title:"All Students", content: ""},
    { id: "btn2", title:"Pending Students", content: <AllPendingStudents /> }
  ];
  

  if (isLoading) {
    return <Loader />;
  }
  const handleClick = (id) => {
    setActiveItem(id);
  };
  
  return (
    <Fragment>
      <MetaData title={`${user.name}'s DashBoard`} />

     <div className="btnGroup">
      {allButtons.map((item) => (
          <div
            key={item.id}
            className= {`btn button ${activeItem === item.id ? "active" : ""}`}
            id={item.id}
            onClick={() => handleClick(item.id)}
          >
            <img
              src={createBatchIcon}
              alt="createBatchIcon"
              className="icon"
            />
            <p>{item.title}</p>
          </div>
        ))}
     </div>
     <div className="contentSection">
        {/* Display content of the active item */}
        {allButtons.find((item) => item.id === activeItem)?.content || "Please select an item from the list."}
      </div>
    </Fragment>
  );
}

export default Student;