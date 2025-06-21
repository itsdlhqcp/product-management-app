import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, formData);
      navigate("/signin");
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    }
  };
  
  return (
    <div className="auth-wrapper">
      {/* Left Side - Welcome Back */}
      <div className="auth-left">
        <div className="geometric-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
        <div className="welcome-content">
          <h1>Welcome Back!</h1>
          <p>To keep connected with us please login with your personal info</p>
          <a href="/signin" className="welcome-btn">SIGN IN</a>
        </div>
      </div>

      {/* Right Side - Create Account Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <h2>Create Account</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input 
                name="name" 
                type="text" 
                placeholder="Name" 
                onChange={handleChange} 
                required 
              />
            </div>
            
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
            
            <button type="submit" className="auth-button">SIGN UP</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;