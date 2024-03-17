import { useState, FormEvent, ChangeEvent, CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import Transition from "../components/Transition";
import ThreejsPlane from "../components/ImagePlane";
import Button from "../components/Button";
import SignupAnimation from "../components/SignupAnimation";

const SignUp = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number:"",
    username: "",
    password: "",
   
  });
  const [, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const { msg } = await res.json();

      if (res.status === 400) {
        throw new Error(msg);
      }
      console.log(msg);

      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <section className="px-5 xl:px-0  h-screen w-screen flex items-center justify-center">
      <Transition />
      <ThreejsPlane />

      <div className="mx-auto w-full flex z-10">
        {/* <div className="w-2/5 h-[300px] ml-10">
          <SignupAnimation />
        </div> */}
        <div style={styles.container}>
          <h1 style={styles.heading}>Signup</h1>

          <label htmlFor="first_name" className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            placeholder="First Name"
            className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />

          <label htmlFor="last_name" className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />

          <label htmlFor="phone_number" className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact Number</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            placeholder="PhoneNumber"
            className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />

          <label htmlFor="email" className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
          <input
            type="email"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Email"
            className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />

          <label htmlFor="password" className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            name="password"
            placeholder="Password"
            className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          <Button width='w-full' height='h-5' text='Signup' onClick={handleSubmit}></Button>
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

export default SignUp;
