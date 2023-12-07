import Transition from '../components/Transition';
import Buttton from '../components/Button';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { useEffect, useRef, useState } from 'react';
import MapComponent from '../components/MapComponent';
import { getCoordinatesFromAddress } from '../services/googleApiService';
import './RideSearch.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface BookedRideType {
  rideID: number;
  first_name: string;
  last_name: string;
  driver_rating: number;
}
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: '25rem'
};

const center = {
  lat: 40.735657,
  lng: -74.172363
};

interface CorsType {
  lat: number | null;
  lng: number | null;
}

const RideSearch = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, dispatch } = useAuth();
  const {
    ready: readyFrom,
    value: valueFrom,
    setValue: setValueFrom,
    suggestions: suggestionsFrom,
    clearSuggestions: clearSuggestionsFrom
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300,
  });

  const {
    ready: readyTo,
    value: valueTo,
    setValue: setValueTo,
    suggestions: suggestionsTo,
    clearSuggestions: clearSuggestionsTo
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300,
  });

  const [formData, setFormData] = useState({
    seats: '',
    date: '',
  });

  const [srcCor, setSrcCor] = useState<CorsType>({ lat: null, lng: null });
  const [destCor, setDestCor] = useState<CorsType>({ lat: null, lng: null });
  const [bookedRide, setBookedRide] = useState<BookedRideType>({
    rideID: 0,
    first_name: '',
    last_name: '',
    driver_rating: 0,
  });
  const [src, setSrc] = useState<string>('');
  const [dest, setDest] = useState<string>('');

  const [rideFound, setRideFound] = useState(false);

  const renderSuggestionsFrom = () =>
    suggestionsFrom.data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li className='cursor-pointer text-left' key={place_id} onClick={handleSelectFrom(place_id, main_text)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  const renderSuggestionsTo = () =>
    suggestionsTo.data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li className='cursor-pointer text-left' key={place_id} onClick={handleSelectTo(place_id, main_text)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  const onRideSearch = async () => {
    try {
      const response = await axios.post('http://localhost:3000/ride/schedule', {
        "source_addr": src,
        "dest_addr": dest,
      }, { 
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        } 
      });

      console.log('Ride data:', response.data);
      if (response.status === 200) {
        setBookedRide({
          rideID: response.data.rideDetails.rideID,
          first_name: response.data.rideDetails.driverInfo[0].first_name,
          last_name: response.data.rideDetails.driverInfo[0].last_name,
          driver_rating: response.data.rideDetails.driverInfo[0].river_rating,
        });
        setRideFound(true);
      }
    } catch (error) {
      console.error(error);
      toast.error('Ride not found!');
      setRideFound(false);
    }
  };

  const handleSelectFrom = (place_id: string, main_text: string) => async () => {
    try {
      setValueFrom(main_text, false);
      clearSuggestionsFrom();
      const { lat, lng } = await getCoordinatesFromAddress(place_id);
      setSrcCor({ lat, lng });
      setSrc(place_id);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const handleSelectTo = (place_id: string, main_text: string) => async () => {
    try {
      setValueTo(main_text, false);
      clearSuggestionsTo();
      const { lat, lng } = await getCoordinatesFromAddress(place_id);
      setDestCor({ lat, lng });
      setDest(place_id);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const profileRef = useRef(null);
  const profileImageRef = useRef(null);

  useEffect(() => {
    const profileElement = profileRef.current;
    const profileImageElement = profileImageRef.current;

    if (profileElement) {
      const profile = gsap.timeline();
      profile.from(profileElement, {
        duration: 1,
        y: '100%',
        opacity: 0,
        ease: Power4.easeOut,
        delay: 1,
      });
    }

    if (profileImageElement) {
      const profile = gsap.timeline();
      profile.from(profileImageElement, {
        duration: 1,
        y: '-100%',
        opacity: 0,
        ease: Power4.easeOut,
        delay: 1,
      });
    }
  }, []);
  
  useEffect(() => {
    const isToken = localStorage.getItem("token");
    console.log('isToken', isToken);
    if(!isToken) {
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
      <ToastContainer />
      <div className='min-h-screen bg-black absolute z-10 w-screen flex flex-col items-center'>
        <div className='flex flex-col w-full'>
          <MapComponent srcLat={srcCor.lat} srcLng={srcCor.lng} destLat={destCor.lat} destLng={destCor.lng} />
          <form className='mt-10 px-52 max-md:px-20'>
            <div className="grid gap-6 mb-6 grid-cols-2 max-md:grid-cols-1">
              <div className="col-span-1">
                <label htmlFor="source" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">From?</label>
                <input
                  type="text"
                  value={valueFrom}
                  onChange={e => setValueFrom(e.target.value)}
                  id="source"
                  className="input-container border border-solid border-white text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="271 Van Wagenene Ave, Jersey City"
                  required
                />
                {suggestionsFrom.status === 'OK' && <ul>{renderSuggestionsFrom()}</ul>}
              </div>
              <div className="col-span-1">
                <label htmlFor="destination" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Where To?</label>
                <input
                  type="text"
                  value={valueTo}
                  onChange={e => setValueTo(e.target.value)}
                  id="destination"
                  className="input-container border border-solid border-white text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="NJIT Campus Center"
                  required
                />
                {suggestionsTo.status === 'OK' && <ul>{renderSuggestionsTo()}</ul>}
              </div>
            </div>

            <div className="grid gap-6 mb-6 grid-cols-3 max-md:grid-cols-1">
              <div className="col-span-1">
                <label htmlFor="seats" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">No of Seats Required</label>
                <input
                  value={formData.seats}
                  onChange={(e) => (
                    setFormData((prev) => ({ ...prev, seats: e.target.value }))
                  )}
                  type="text"
                  id="seats"
                  className="input-container border border-solid border-white text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="No of Seats"
                  required
                />
              </div>
              <div className="col-span-1 mt-2 max-md:hidden">
                <Buttton width='w-full' height='h-5' onClick={onRideSearch} text={'Submit'} />
              </div>
              <div className="col-span-1">
                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                <input
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  type="text"
                  id="date"
                  className="input-container border border-solid border-white text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="mm-dd-yyyy"
                  required
                />
              </div>
              <div className="col-span-1 mt-2 md:hidden">
                <Buttton width='w-full' height='h-5' onClick={onRideSearch} text={'Search'} />
              </div>
            </div>
          </form>
          
          {
            rideFound && (
              <div className='flex flex-col items-center'>
                <div className='flex flex-col items-center' ref={profileRef}>
                  <div className='flex flex-col items-center'>
                    <div className='flex flex-col items-center' ref={profileImageRef}>
                      <div className='my-5'>
                        Your Ride is booked!
                      </div>
                      <img src='https://i.imgur.com/8Km9tLL.png' alt='profile' className='w-20 h-20 rounded-full' />
                      <p className='text-white text-lg mt-2'>{bookedRide.first_name} {bookedRide.last_name}</p>
                      <p className='text-white text-lg mt-2'>{bookedRide.driver_rating}</p>
                    </div>
                    <div className='flex flex-col items-center mt-4'>
                      <p className='text-white text-lg mt-2'>Ride ID: {bookedRide.rideID}</p>
                      <p className='text-white text-lg mt-2'>Date: {formData.date}</p>
                      <p className='text-white text-lg mt-2'>Seats: {formData.seats}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

        </div>
      </div>
    </>
  )
}

export default RideSearch;
