import React, { Fragment } from "react";

import "./home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Fragment>
      <div>Science Tent</div>
      <Link to={"/login"}>Login or Sign Up</Link>
      <div className="btn btn-primary">hello</div>
    </Fragment>
  );
}

export default Home;
