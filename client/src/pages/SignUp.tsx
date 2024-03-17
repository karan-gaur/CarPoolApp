import { useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import signupImg from "../assets/carpool-graphic1.png";
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
  const [loading, setLoading] = useState(false);

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

      <div className="max-w-[1170px] mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 ">
          {/* ============ img box ========= */}
          <div className="w-full h-full">
            {/* <figure className="rounded-l-lg w-full h-full">
              <img className="w-full h-full rounded-l-lg object-cover" src={signupImg} alt="" />
            </figure> */}
            <SignupAnimation />
          </div>
  
          <div className="rounded-l-lg  lg:pl-16 py-10">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
              Create an <span className="text-[#0067FF]">Account</span>
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="PhoneNumber"
                  className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
  
              <div className="mb-5">
                <input
                  type="email"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
  
              <div className="mb-5">
                <input
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  name="password"
                  placeholder="Password"
                  className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              
  
              <div className="mt-7">
                <Button width='w-full' height='h-5' text='Sign Up' onClick={handleSubmit}></Button>

                {/* <button
                  type="submit"
                  disabled={loading && true}
                  className="w-full bg-[#0067FF] text-white py-3 px-4 rounded-lg text-[18px] leading-[30px]"
                 
                >
                 
                  Sign Up
                </button> */}
              </div>
  
              <p className="mt-5 text-textColor text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-[#0067FF] font-medium">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
  
};

export default SignUp;
