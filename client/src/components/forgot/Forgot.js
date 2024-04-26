import axios from "axios";
import { apiUrl } from "../../../server.json"
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
import { CircularProgress } from "@material-ui/core";

const Forgot = () => {
  const [otp, setOtp] = useState(null);
  const [otpExpiration, setOtpExpiration] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const { data } = useFetch(`/users/`);
  const [credentials, setCredentials] = useState("");
  const [userid, setUserid] = useState("");
  const [username, setUsername] = useState("");
  const [email, setUseremail] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [info, setInfo] = useState({});
  const [error, setError] = useState({
    email: false,
    otp: false, 
  });


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

  
  const handleOTPVerification = async () => {
    try {
      const res = await axios.post(`${apiUrl}/auth/verify-otp`, {
        email: email, 
        otp: otpInput,
      });
  
      if (res.data) {
        toast.success("OTP verified successfully.");
        navigate("/forgotid", { state: { userid, username } });
      } else {
        toast.error("Incorrect OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Incorrect OTP. Please try again.");
    }
  };
    

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      data.forEach((element) => {
        if (credentials === element.email) {
          setUserid(element._id);
          setUsername(element.username);
          setUseremail(element.email);
        }
      });
  
      Swal.fire({
        icon: "success",
        title: "Connect Success",
        text: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error connecting email. Please try again.");
    }
  
    setLoading(false);
  };

  
  const handleclick = async (e) => {
    e.preventDefault();
  
    if (userid === "") {
      toast.error("Email not found! Please check your email and reconnect it again.");
    } else {
      setLoading(true);
  
      try {
        const res = await axios.post(`${apiUrl}/auth/send-otp`, { email });
  
        if (res.status === 200) {
          toast.info("Email Connected! A verification OTP has been sent to your email.");
          setShowOtpForm(true);
        } else {
          toast.error("Failed to send OTP. Please try again.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to send OTP. Please try again.");
      }
  
      setLoading(false);
    }
  };
  

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <body className="regBody123">
      {!showOtpForm && (
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
              className={`lInput ${error.email ? "error" : ""}`}
              placeholder="Email"
              id="email"
              onChange={(e) => setCredentials(e.target.value)}
            />

            <button
              disabled={loading}
              onClick={handleClick}
              className="lButton97"
            >
              Connect Email
            </button>
            <button
              disabled={loading}
              onClick={handleclick}
              className="lButton97"
            >
              {loading ? (
                  <CircularProgress size={19} color="white" />
                ) : (
                  "Reset Password"
                )}
            </button>
          </div>
        </div>
      )}
      {showOtpForm && (
        <div className="lContainer">
          <input
            type="text"
            placeholder="Enter OTP"
            id="otp"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)} 
            className={`lInput ${error.otp ? "error" : ""}`}
          />
          <button onClick={handleOTPVerification} className="lButton">
            Verify OTP
          </button>
        </div>
      )}
    </body>
  );
};

export default Forgot;