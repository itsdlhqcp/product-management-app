import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signin`, formData);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.msg || "Signin failed");
    }
  };
  
  return (
    <div className="auth-wrapper">
      {/* Left Side - Sign In Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <h2>Sign In to<br />Your Account</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon">✉️</span>
              <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input 
                name="password" 
                type="password" 
                placeholder="Password" 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="forgot-password">
              <a href="#forgot">forgot password?</a>
            </div>
            
            <button type="submit" className="auth-button">SIGN IN</button>
          </form>
        </div>
      </div>

      {/* Right Side - Hello Friend */}
      <div className="auth-left">
        <div className="geometric-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
        <div className="welcome-content">
          <h1>Hello Friend!</h1>
          <p>Enter your personal details and start your journey with us</p>
          <a href="/signup" className="welcome-btn">SIGN UP</a>
        </div>
      </div>
    </div>
  );
}

export default SignIn;