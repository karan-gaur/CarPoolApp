import React, { CSSProperties } from "react";
import { useContext, useState } from "react";

import { AuthContext } from "../context/AuthContext";
import Button from '../components/Button';
import { useNavigate } from "react-router-dom";
import ThreejsPlane from "../components/ImagePlane";
import Transition from "../components/Transition";

const Login = () => {
  const BASE_URL = "http://localhost:3000";

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    // Handle the case where AuthContext is undefined (e.g., throw an error or return early)
    throw new Error("AuthContext is not provided");
  }

  const { dispatch } = authContext;

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.msg);
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: result.data,
          token: result.token,
        },
      });

      localStorage.setItem("token", result.token);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <section className="px-5 xl:px-0 h-screen w-screen flex items-center justify-center">
      <Transition />
      <ThreejsPlane />

      <div className="mx-auto w-full flex z-10">
        {/* <div className="w-2/5 h-[300px] ml-10">
          <SignupAnimation />
        </div> */}
        <div style={styles.container}>
          <h1 style={styles.heading}>Login</h1>

          <label htmlFor="email" className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
          <input
            type="email"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="Enter your email"
            className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />

          <label htmlFor="password" className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="Enter your password"
            className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />

          <Button width='w-full' height='h-5' text='Login' onClick={handleLogin}></Button>
        </div>
      </div>
    </section>

  );
};

const styles: { [key: string]: CSSProperties } = {
  page: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  container: {
    width: "25%",
    maxWidth: "800px", // You can adjust this value
    margin: "50px auto", // Center the container horizontally
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "3px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "3px",
    background: "#007BFF",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },
};
export default Login;
