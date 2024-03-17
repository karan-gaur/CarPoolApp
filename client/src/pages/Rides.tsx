import Transition from "../components/Transition";
import ThreejsPlane from "../components/ImagePlane";
import "./Rides.css";
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";

interface RideType {
  ride_id_pk: number;
  seats: number;
  number: string;
  make: string;
  model: string;
  ride_completed: boolean;
  seats_available: number;
  departure_time: number;
  source_id: string;
  dest_id: string;
}

const RideListItem = ({ ride }: { ride: RideType }) => (
  <div key={ride.ride_id_pk} className="grid grid-cols-3 mb-5 box rounded-3xl border text-white border-gray-600 w-4/5  focus:ring-blue-500 focus:border-blue-500">
    <ul className="ride-list ml-10 col-span-1">
      <li className="ride-list-item-1 mt-5">
        <div className="bullet big">
          <svg aria-hidden="true" viewBox="0 0 32 32" focusable="false"><path d="M16 4c6.6 0 12 5.4 12 12s-5.4 12-12 12S4 22.6 4 16 9.4 4 16 4zm0-4C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0z"></path><circle cx="16" cy="16" r="6"></circle></svg>
        </div>
        <strong>{ride.source_id.split(',')[0]}</strong> <small>{`${ride.source_id.split(',')[1]}, ${ride.source_id.split(',')[2]}`}</small>
      </li>
      <li className="ride-list-item-2 mt-9">
        <div className="bullet big">
          <svg aria-hidden="true" viewBox="0 0 32 32" focusable="false"><path d="M16 4c6.6 0 12 5.4 12 12s-5.4 12-12 12S4 22.6 4 16 9.4 4 16 4zm0-4C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0z"></path><circle cx="16" cy="16" r="6"></circle></svg>
        </div>
        <strong>{ride.dest_id.split(',')[0]}</strong> <small>{`${ride.dest_id.split(',')[1]}, ${ride.dest_id.split(',')[2]}`}</small>
      </li>
    </ul>

    <div className="flex flex-col ml-16 col-span-1">
      <div className="mt-8 mb-5">
        Ride Status: <span className={ride.ride_completed ? "text-green-500" : "text-red-500"}>{ride.ride_completed ? "Completed" : "Not Completed"}</span>
      </div>
      <Link to={`/rides/${ride.ride_id_pk}`} className="text-blue-500 underline mt-2">View Ride Details</Link>

    </div>

    <div className="flex flex-col ml-5 col-span-1">
      <div className="mt-8">
        Car Make: <span className="text-blue-500">{ride.make}</span>
      </div>
      <div>
        Car Model: <span className="text-blue-500">{ride.model}</span>
      </div>
      <div>
        Car Number: <span className="text-blue-500">{ride.number}</span>
      </div>
      <div>
        Car Seats: <span className="text-blue-500">{ride.seats}</span>
      </div>
    </div>
  </div>
);

const Rides = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, dispatch } = useAuth();
  const [rides, setRides] = useState<RideType[]>([]);
  const [selectedOption, setSelectedOption] = useState('');

  const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

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

  const handleNavClick = async (isDriver: boolean, completed: boolean) => {
    try {

      const response = await axios.post(`${BASE_URL}/ride/history`, {
        "is_driver": isDriver,
        "completed": completed
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const rideList = response.data.rides.map((ride: RideType) => ({
        ride_id_pk: ride.ride_id_pk,
        seats: ride.seats,
        number: ride.number,
        make: ride.make,
        model: ride.model,
        ride_completed: ride.ride_completed,
        seats_available: ride.seats_available,
        departure_time: ride.departure_time,
        source_id: ride.source_id,
        dest_id: ride.dest_id,
      }));

      setRides(rideList);
    } catch (error) {
      // Handle errors here, e.g., display an error message to the user
      console.error('Error fetching ride data:', error);
    }
  };


  return (
    <>
      <Transition />
      <div className='min-h-screen w-full flex flex-col items-center'>
        <ThreejsPlane />
        <div className='w-full flex justify-center relative bg-transparent profile-header mt-32 text-6xl'>
          Rides
        </div>
        <div className='w-full flex flex-row justify-around bg-transparent z-10 mb-32'>
          <button onClick={() => { handleNavClick(true, true); setSelectedOption('driverComplete'); }}
            className={selectedOption === 'driverComplete' ? 'underline-button' : ''}
          >
            As a Driver-Complete Rides
          </button>
          <button onClick={() => { handleNavClick(true, false); setSelectedOption('driverIncomplete'); }}
            className={selectedOption === 'driverIncomplete' ? 'underline-button' : ''}
          >
            As a Driver-Incomplete Rides
          </button>
          <button onClick={() => { handleNavClick(false, true); setSelectedOption('passengerComplete'); }}
            className={selectedOption === 'passengerComplete' ? 'underline-button' : ''}
          >
            As a Passenger-Complete Rides
          </button>
          <button onClick={() => { handleNavClick(false, false); setSelectedOption('passengerIncomplete'); }}
            className={selectedOption === 'passengerIncomplete' ? 'underline-button' : ''}
          >
            As a Passenger-Incomplete Rides
          </button>
        </div>
        <div className='w-full flex flex-col items-center justify-center relative bg-transparent'>
          {rides.length > 0 ? (
            rides.map((ride) => <RideListItem key={ride.ride_id_pk} ride={ride} />)
          ) : (
            <h1 className="text-white text-lg">Wow! Such an empty place.</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default Rides;



{/* <div>
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
              </div> */}