import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/admin/auth/login`, credentials);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Admin Login</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Username" 
            value={credentials.username} 
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} 
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={credentials.password} 
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
          />
          
          <button 
            onClick={handleLogin} 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};
