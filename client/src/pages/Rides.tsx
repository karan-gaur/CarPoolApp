import Transition from "../components/Transition";
import ThreejsPlane from "../components/ImagePlane";
import "./Rides.css"
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
const Rides = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, dispatch } = useAuth();

  useEffect(() => {
    const isToken = localStorage.getItem("token");
    console.log('isToken', isToken);
    if (!isToken) {
      console.log("Not Authenticated");
      navigate("/login");
    } else {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: user,
          token: isToken,
        },
      });
    }
  }, [isAuthenticated, token, user, navigate, dispatch]);

  return (
    <>
      <Transition />
      <div className='min-h-screen w-full flex flex-col items-center'>
        <ThreejsPlane />
        <div className='w-full flex justify-center relative bg-transparent profile-header mt-32 text-6xl'>
          Rides
        </div>
        <div className='w-full flex flex-col items-center justify-center relative bg-transparent'>
          <div className="flex max-md:flex-col box rounded-3xl border text-white border-gray-600 w-3/5  focus:ring-blue-500 focus:border-blue-500">
            <ul className="ride-list ml-10">
              <li className="ride-list-item-1 mt-5">
                <div className="bullet big">
                  <svg aria-hidden="true" viewBox="0 0 32 32" focusable="false"><path d="M16 4c6.6 0 12 5.4 12 12s-5.4 12-12 12S4 22.6 4 16 9.4 4 16 4zm0-4C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0z"></path><circle cx="16" cy="16" r="6"></circle></svg>
                </div>
                <strong>271 Van Wagenen Ave</strong> <small>Jersey City, New Jersey</small>
              </li>
              <li className="ride-list-item-2 mt-9">
                <div className="bullet big">
                  <svg aria-hidden="true" viewBox="0 0 32 32" focusable="false"><path d="M16 4c6.6 0 12 5.4 12 12s-5.4 12-12 12S4 22.6 4 16 9.4 4 16 4zm0-4C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0z"></path><circle cx="16" cy="16" r="6"></circle></svg>
                </div>
                <strong>NJIT Campus Center</strong> <small>Newark, New Jersey</small>
              </li>
            </ul>
            <div className="flex flex-col ml-10">
              <div>
                  <div className="rate mt-5">
                    <div>Driver Rating:</div>
                    <input type="radio" id="star5" name="rate" value="5" />
                    <label htmlFor="star5" title="text">5 stars</label>
                    <input type="radio" id="star4" name="rate" value="4" />
                    <label htmlFor="star4" title="text">4 stars</label>
                    <input type="radio" id="star3" name="rate" value="3" />
                    <label htmlFor="star3" title="text">3 stars</label>
                    <input type="radio" id="star2" name="rate" value="2" />
                    <label htmlFor="star2" title="text">2 stars</label>
                    <input type="radio" id="star1" name="rate" value="1" />
                    <label htmlFor="star1" title="text">1 star</label>
                  </div>
                  <div className="rate mt-5 ml-5">
                    <div>Customer Rating:</div>
                    <input type="radio" id="star5" name="rate" value="5" />
                    <label htmlFor="star5" title="text">5 stars</label>
                    <input type="radio" id="star4" name="rate" value="4" />
                    <label htmlFor="star4" title="text">4 stars</label>
                    <input type="radio" id="star3" name="rate" value="3" />
                    <label htmlFor="star3" title="text">3 stars</label>
                    <input type="radio" id="star2" name="rate" value="2" />
                    <label htmlFor="star2" title="text">2 stars</label>
                    <input type="radio" id="star1" name="rate" value="1" />
                    <label htmlFor="star1" title="text">1 star</label>
                  </div>
              </div>
              <div className="mt-8 mb-5 ml-3">
                Ride Status: <span className="text-green-500">Completed</span>
              </div>
            </div>
              
          </div>          
        </div>
      </div>

    </>
  )
}

export default Rides