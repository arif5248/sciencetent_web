import React, { Fragment, useState } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";

// import ProfilePng from "../../images/user.png";
import createBatchIcon from "../../images/icons/createBatch.png";
// import leftArrow from "../../images/icons/leftArrow.png";

import "./batch.css";
import CreateBatch from "../batch/createBatch";

function Batch() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(null);
  const { user, isLoading } = useSelector((state) => state.user);

  const allButtons = [
    { id: "btn1", title:"Create Batch", content: <CreateBatch />},
    { id: "btn2", title:"All Batch", content: "Content for Create Batch2" },
    { id: "btn3", title:"Batch Details", content: "Content for Create Batch3" },
    { id: "btn4", title:"Delete Batch", content: "Content for Create Batch4" },
    { id: "btn5", title:"Edit Batch", content: "Content for Create Batch5" }
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
     <div className="container">
        {/* Display content of the active item */}
        {allButtons.find((item) => item.id === activeItem)?.content || "Please select an item from the list."}
      </div>
    </Fragment>
  );
}

export default Batch;
