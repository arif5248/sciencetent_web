import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserLogout } from "../../../slice/userSlice";
import Loader from "../loader/loader";
import logo from "../../../images/logo/STlogo.png";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, user } = useSelector((state) => state.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const onMouseOver = () => {
    setShowDropdown(true);
  };

  const userLogout = async () => {
    try {
      const resultAction = await dispatch(fetchUserLogout()).unwrap();
      setMessage(resultAction.message); // Assuming the backend sends a success message
      navigate("/");
    } catch (error) {
      setMessage(error.message); // Display the error message from the backend
      setIsError(true);
    }
    setTimeout(() => {
      setMessage("");
      setIsError(false);
    }, 3000);
  };

  return (
    <Fragment>
      {isLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <Navbar className="navBar my-text" expand="lg">
            <Container>
              <Navbar.Brand as={Link} to="/" className="nab-brand my-text">
                <img src={logo} alt="ScienceTent" className="logo" />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="nab-item ml-auto">
                  <Nav.Link as={Link} to="/">
                    Home
                  </Nav.Link>
                  <Nav.Link as={Link} to="/blog">
                    Blogs
                  </Nav.Link>
                  <Nav.Link as={Link} to="/about-us">
                    About Us
                  </Nav.Link>
                  <Nav.Link as={Link} to="/contact-us">
                    Contact Us
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>

              <div className="nav-icon-box">
                {user ? (
                  <Nav.Link as={Link} to="/login">
                    <div className="user-icon" onMouseOver={onMouseOver}>
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <Dropdown
                      className="user-dropdown"
                      show={showDropdown}
                      onMouseLeave={() => setShowDropdown(false)}
                    >
                      <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/dashboard">
                          Dashboard
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/profile">
                          Update Profile
                        </Dropdown.Item>
                        <Dropdown.Item onClick={userLogout}>
                          Logout
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Nav.Link>
                ) : (
                  <Nav.Link as={Link} to="/login">
                    <FontAwesomeIcon icon={faUser} />
                  </Nav.Link>
                )}
              </div>
            </Container>
          </Navbar>
          {message && (
            <div
              className={`alert ${
                isError ? "alert-danger" : "alert-success"
              } logoutAlert`}
              role="alert"
            >
              {message}
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}

export default Header;
