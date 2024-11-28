import React, { Fragment, useRef, useState, useEffect } from "react";
import "./loginSignUp.css";
import Loader from "../layout/loader/loader";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserLogin, fetchUserRegister } from "../../slice/userSlice";
// import { useAlert } from "react-alert";
import MetaData from "../layout/metaData/metaData";

const LoginSignUp = () => {
  const [showError, setError] = useState("");
  const dispatch = useDispatch();
  // const alert = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  const { error, isAuthenticated } = useSelector((state) => state.user);

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const loginSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // Show loader
      const result = await dispatch(
        fetchUserLogin({ email: loginEmail, password: loginPassword })
      ).unwrap();
      console.log(result);
      console.log("Successfully Logged In");
      navigate("/account");
    } catch (error) {
      console.error("Error Log In:", error);
      setError(error);
      // console.log("++++++++++++++", error)
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const registerSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // Show loader
      const myForm = new FormData();
      myForm.set("name", name);
      myForm.set("email", email);
      myForm.set("password", password);

      const result = await dispatch(fetchUserRegister(myForm)).unwrap();
      console.log(result);
      console.log("Registered successfully");
      navigate("/account");
    } catch (error) {
      console.error("Error in Registration:", error);
      setError(error);
      // console.log("==============", error)
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const registerDataChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const redirect = location?.search
    ? location.search.split("=")[1]
    : "/account";

  useEffect(() => {
    if (error) {
      // alert.error(error);
    }

    if (isAuthenticated) {
      navigate(redirect);
    }

    // Initially set the login tab as active and show the login form
    switchTabs(null, "login"); // This ensures the login form is displayed by default

  }, [dispatch, error, navigate, isAuthenticated, redirect]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");
  
      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
  
      // Highlight the active tab
      document.querySelector(".login_signUp_toggle p.login").classList.add("active");
      document.querySelector(".login_signUp_toggle p.register").classList.remove("active");
  
      // Show login form, hide register form
      loginTab.current.style.display = "block";
      registerTab.current.style.display = "none";
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");
  
      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
  
      // Highlight the active tab
      document.querySelector(".login_signUp_toggle p.register").classList.add("active");
      document.querySelector(".login_signUp_toggle p.login").classList.remove("active");
  
      // Show register form, hide login form
      registerTab.current.style.display = "block";
      loginTab.current.style.display = "none";
    }
  };
  

  return (
    <Fragment>
      <MetaData title={`Login or Registration`} />
      
      <div className="LoginSignUpContainer">
      {error  && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
        <div className="LoginSignUpBox">
          
          <div>
            <div className="login_signUp_toggle">
              <p onClick={(e) => switchTabs(e, "login")} className="login">
                LOGIN
              </p>
              <p onClick={(e) => switchTabs(e, "register")} className="register">
                REGISTER
              </p>
            </div>
            <button ref={switcherTab}></button>
          </div>
          <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
            <div className="loginEmail">
              <input
                type="email"
                placeholder="Email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="loginPassword">
              <input
                type="password"
                placeholder="Password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <Link to="/password/forgot">Forget Password ?</Link>
            <input type="submit" value="Login" className="loginBtn" />
          </form>
          <form
            className="signUpForm"
            ref={registerTab}
            encType="multipart/form-data"
            onSubmit={registerSubmit}
          >
            <div className="signUpName">
              <input
                type="text"
                placeholder="Name"
                required
                name="name"
                value={name}
                onChange={registerDataChange}
              />
            </div>
            <div className="signUpEmail">
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={registerDataChange}
              />
            </div>
            <div className="signUpPassword">
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                value={password}
                onChange={registerDataChange}
              />
            </div>

            <input type="submit" value="Register" className="signUpBtn" />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginSignUp;
