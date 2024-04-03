import axios from "axios";
import { apiUrl } from "../../../server.json"
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.scss";
import { CircularProgress } from "@material-ui/core";
import { toast } from "react-toastify";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  
  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(`${apiUrl}/auth/login`, credentials);
      if(res.data.isAdmin) {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        toast.success('Login Successful!');
        navigate("/");
      } else {
        dispatch({
          type:"LOGIN_FAILURE", 
          payload: {message:"You don't have permission to access"}
        });
      }
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };


  return (
    <div className="login">
      <div className="lContainer">
          <input
            type="text"
            placeholder="Admin Email"
            id="email"
            onChange={handleChange}
            className="lInput"
          />
          <input
            type="password"
            placeholder="Admin Password"
            id="password"
            onChange={handleChange}
            className="lInput"
          />
          <button disabled={loading} onClick={handleClick} className="lButton">
          {loading ? <CircularProgress size={19} color="white" /> : "Login"}
          </button>
          {error && <span class="colorspan">{error.message}</span>}
      </div>
    </div>
  );
};

export default Login;