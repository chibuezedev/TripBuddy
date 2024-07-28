import { useState } from "react";
import { login, signup } from "../../services/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser, setSecret }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async () => {
    // Validate inputs
    if (!email) {
      toast.error("Email is required.");
      return;
    }

    if (!password) {
      toast.error("Password is required.");
      return;
    }

    if (isRegister) {
      if (!email) {
        toast.error("Email is required.");
        return;
      }

      if (!validateEmail(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    try {
      let response;
      if (isRegister) {
        response = await signup({ username, email, password });
        if (response.status === 201) {
          toast.success("Registration successful!");
          
          if (response.token) {
            localStorage.setItem("token", response.token);
            localStorage.setItem("username", response.user.username);
            setUser(response.user.username);
            setSecret(response.token);
          } else {
            toast.warn("Registration successful, but no token received.");
          }
        } else {
          toast.error(
            response.message || "An error occurred during registration."
          );
        }
      } else {
        response = await login({ email, password });
        if (response.status === 200) {
          if (response.token) {
            localStorage.setItem("token", response.token);
            const user = localStorage.setItem("user", response.user);
            console.log("local user", user);
            setUser(response.user.username);
            setSecret(response.token);
            navigate("/chat");
          } else {
            toast.warn("Login successful, but no token received.");
          }
        } else {
          toast.error(
            response.message || "An error occurred during login."
          );
        }
      }
    } catch (err) {
      if (err.error) console.error("Failed to authenticate:", err.error);
      toast.error(err.error);
    }
  };

  return (
    <div className="login-page">
      <ToastContainer />
      <div className="login-container">
        <h2 className="title"> Welcome to TripBuddy!</h2>
        <p
          className="register-change"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Already a user?" : "Are you a new user?"}
        </p>

        <div>
          {isRegister && (
            <input
              className="login-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="login-actions">
          <button type="button" onClick={handleLogin}>
            {isRegister ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
