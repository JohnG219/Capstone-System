import axios from "axios";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import "./Forgot.css";
import { Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Forgot = () => {
  const { data, loading, error } = useFetch(`/users/`);
  const [credentials, setCredentials] = useState("");
  const [userid, setUserid] = useState("");
  const [username, setUsername] = useState("");
  const [email, setUseremail] = useState("");
  // setUseremail(element.useremail)
  const navigate = useNavigate();
  const [info, setInfo] = useState({});

  const [countdown, setCountdown] = useState(10); 
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const startCountdown = () => {
    setIsCountdownActive(true);
    let timeLeft = countdown;

    const countdownInterval = setInterval(() => {
      timeLeft--;
      setCountdown(timeLeft);

      if (timeLeft === 0) {
        clearInterval(countdownInterval);
        navigate("/forgotid", { state: { userid, username } });
      }
    }, 100); 
  };

  const handleClick = async (e) => {
    e.preventDefault();
    data.forEach((element) => {
      if (credentials == element.email) {
        setUserid(element._id);
        setUsername(element.username);
      }
    });
    Swal.fire({
      icon: "success",
      title: "Connect Success",
      text: "",
    });
  };

  const handleclick = async (e) => {
    e.preventDefault();
    if (userid == "") {
        toast.error('Email not found! please check your email and reconnect it again...');
    } else {
        toast.success('Email Connected! you can now reset your password');
      startCountdown(); 
  };
}

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <body className="regBody123">
      <div className="login123" style={{
      maxWidth: "100%", 
      height: "auto",   
      display: "block", 
      margin: "0 auto" 
  }}>
        <NavLink to="/login" className="close-button" onClick={handleCancel}>
          <CloseIcon />
        </NavLink>
        <div className="Container99">
          <span className="sp">Connect Your Email to Reset Password </span>
          {info.message && (
            <Alert
              severity={info.severity}
              onClose={() => setInfo({})}
              sx={{
                width: "100%",
                maxWidth: "400px",
                fontSize: "13px",
                position: "fixed",
                left: "36%",
                top: "29%",
              }}
            >
              {info.message}
            </Alert>
          )}

          <input
            type="text"
            className="lInput"
            placeholder="Email"
            id="email"
            onChange={(e) => setCredentials(e.target.value)}
          />

          <button
            disabled={loading}
            onClick={handleClick}
            className="lButton97"
          >
            {" "}
            Connect Email
          </button>
          <button
            disabled={loading}
            onClick={handleclick}
            className="lButton97"
          >
            Reset Password
          </button>
        </div>
      </div>
    </body>
  );
};

export default Forgot;
